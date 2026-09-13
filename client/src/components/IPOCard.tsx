import { Link } from "react-router-dom";
import type { IPO } from "@/types/ipo";
import { IPOStatusBadge } from "./IPOStatusBadge";
import { GMPBadge } from "./GMPBadge";
import { Sparkline } from "./Sparkline";
import { LastUpdated } from "./LastUpdated";
import { formatDateRange } from "@/lib/utils";
import { Card } from "./ui/card";

export function IPOCard({ ipo }: { ipo: IPO }) {
  return (
    <Card className="group flex flex-col p-4 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link to={`/ipo/${ipo.slug}`} className="font-display font-semibold leading-snug hover:text-brand">
            {ipo.name}
          </Link>
          <p className="mt-0.5 truncate text-xs text-ink-soft">{ipo.company}</p>
        </div>
        <IPOStatusBadge status={ipo.status} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-ink-soft/70">Price band</p>
          <p className="font-mono-data text-sm font-medium">
            ₹{ipo.priceBandMin}–{ipo.priceBandMax}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wide text-ink-soft/70">GMP</p>
          <GMPBadge gmp={ipo.gmp} trend={ipo.gmpTrend} size="sm" />
        </div>
        <Sparkline data={ipo.gmpHistory} trend={ipo.gmpTrend} />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
        <span>{formatDateRange(ipo.openDate, ipo.closeDate)}</span>
        <span className="font-mono-data font-medium text-ink">{ipo.expectedSubscriptionX.toFixed(1)}x sub.</span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <LastUpdated iso={ipo.lastUpdated} />
        <Link to={`/ipo/${ipo.slug}`} className="text-xs font-medium text-brand hover:underline">
          View details
        </Link>
      </div>
    </Card>
  );
}
