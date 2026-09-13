import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import type { GMPPoint } from "@/types/ipo";

export function Sparkline({ data, trend }: { data: GMPPoint[]; trend: "up" | "down" | "flat" }) {
  const color = trend === "up" ? "var(--up)" : trend === "down" ? "var(--down)" : "var(--flat)";
  if (!data || data.length < 2) return <div className="h-8 w-20" />;
  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <defs>
            <linearGradient id={`spark-${trend}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="gmp"
            stroke={color}
            strokeWidth={1.75}
            fill={`url(#spark-${trend})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
