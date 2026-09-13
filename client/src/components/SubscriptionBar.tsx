import { cn } from "@/lib/utils";

function Row({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  const filled = value >= 1;
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-xs text-ink-soft">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-line/60">
        <div
          className={cn("h-full rounded-full transition-all", filled ? "bg-brand" : "bg-gold")}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-14 shrink-0 text-right font-mono-data text-xs font-medium">{value.toFixed(2)}x</span>
    </div>
  );
}

export function SubscriptionBar({
  qib,
  nii,
  retail,
  employee,
  total,
}: {
  qib: number;
  nii: number;
  retail: number;
  employee?: number | null;
  total: number;
}) {
  const max = Math.max(qib, nii, retail, employee ?? 0, total, 1);
  return (
    <div className="space-y-2.5">
      <Row label="QIB" value={qib} max={max} />
      <Row label="NII" value={nii} max={max} />
      <Row label="Retail" value={retail} max={max} />
      {employee != null && <Row label="Employee" value={employee} max={max} />}
      <div className="mt-1 border-t border-line pt-2">
        <Row label="Total" value={total} max={max} />
      </div>
    </div>
  );
}
