import { cn, formatCurrency } from "@/lib/utils";
import type { GMPTrend } from "@/types/ipo";
import { TrendIndicator } from "./TrendIndicator";

export function GMPBadge({
  gmp,
  trend,
  size = "md",
}: {
  gmp: number;
  trend: GMPTrend;
  size?: "sm" | "md";
}) {
  const positive = gmp > 0;
  const negative = gmp < 0;
  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "font-mono-data font-semibold",
          size === "md" ? "text-base" : "text-sm",
          positive && "text-up",
          negative && "text-down",
          !positive && !negative && "text-flat"
        )}
      >
        {positive && "+"}
        {formatCurrency(gmp)}
      </span>
      <TrendIndicator trend={trend} />
    </div>
  );
}
