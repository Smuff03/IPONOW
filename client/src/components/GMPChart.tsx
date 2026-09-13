import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { GMPPoint } from "@/types/ipo";
import { formatCurrency } from "@/lib/utils";

export function GMPChart({ data }: { data: GMPPoint[] }) {
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gmp-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--ink-soft)" }}
            axisLine={{ stroke: "var(--line)" }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--ink-soft)" }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--paper-raised)",
              border: "1px solid var(--line)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={((value: number) => [formatCurrency(value), "GMP"]) as never}
          />
          <Area
            type="monotone"
            dataKey="gmp"
            stroke="var(--brand)"
            strokeWidth={2}
            fill="url(#gmp-fill)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
