import { ArrowUpRight, ArrowRight, ArrowDownRight } from "lucide-react";
import type { GMPTrend } from "@/types/ipo";
import { cn } from "@/lib/utils";

export function TrendIndicator({ trend, className }: { trend: GMPTrend; className?: string }) {
  if (trend === "up")
    return (
      <span className={cn("inline-flex items-center text-up", className)} aria-label="Trending up">
        <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
      </span>
    );
  if (trend === "down")
    return (
      <span className={cn("inline-flex items-center text-down", className)} aria-label="Trending down">
        <ArrowDownRight className="h-4 w-4" strokeWidth={2.5} />
      </span>
    );
  return (
    <span className={cn("inline-flex items-center text-flat", className)} aria-label="Stable">
      <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
    </span>
  );
}
