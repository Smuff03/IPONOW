import { Link } from "react-router-dom";
import type { IPO } from "@/types/ipo";
import { IPOStatusBadge } from "./IPOStatusBadge";
import { GMPBadge } from "./GMPBadge";
import { Sparkline } from "./Sparkline";
import { LastUpdated } from "./LastUpdated";
import { IPOCard } from "./IPOCard";
import { formatDateRange } from "@/lib/utils";
import { EmptyState } from "./ErrorState";

export function IPOTable({ ipos }: { ipos: IPO[] }) {
  if (ipos.length === 0) {
    return <EmptyState title="No IPOs match your filters" message="Try clearing search or switching status tabs." />;
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-x-auto rounded-[var(--radius-card)] border border-line bg-paper-raised md:block">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line bg-ink/[0.02] text-left text-xs uppercase tracking-wide text-ink-soft">
              <th className="p-3 font-medium">IPO name</th>
              <th className="p-3 font-medium">GMP</th>
              <th className="p-3 font-medium">Trend</th>
              <th className="p-3 font-medium">Price band</th>
              <th className="p-3 font-medium">Exp. subscription</th>
              <th className="p-3 font-medium">Est. listing</th>
              <th className="p-3 font-medium">Date</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Last updated</th>
            </tr>
          </thead>
          <tbody>
            {ipos.map((ipo) => (
              <tr key={ipo.id} className="border-b border-line last:border-0 hover:bg-ink/[0.02]">
                <td className="p-3">
                  <Link to={`/ipo/${ipo.slug}`} className="font-medium hover:text-brand">
                    {ipo.name}
                  </Link>
                  <p className="text-xs text-ink-soft">{ipo.company}</p>
                </td>
                <td className="p-3">
                  <GMPBadge gmp={ipo.gmp} trend={ipo.gmpTrend} size="sm" />
                </td>
                <td className="p-3">
                  <Sparkline data={ipo.gmpHistory} trend={ipo.gmpTrend} />
                </td>
                <td className="p-3 font-mono-data whitespace-nowrap">
                  ₹{ipo.priceBandMin}–{ipo.priceBandMax}
                </td>
                <td className="p-3 font-mono-data">{ipo.expectedSubscriptionX.toFixed(1)}x</td>
                <td className="p-3 font-mono-data">₹{ipo.estimatedListing}</td>
                <td className="p-3 whitespace-nowrap text-ink-soft">{formatDateRange(ipo.openDate, ipo.closeDate)}</td>
                <td className="p-3">
                  <IPOStatusBadge status={ipo.status} />
                </td>
                <td className="p-3">
                  <LastUpdated iso={ipo.lastUpdated} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="grid gap-3 md:hidden">
        {ipos.map((ipo) => (
          <IPOCard key={ipo.id} ipo={ipo} />
        ))}
      </div>
    </>
  );
}
