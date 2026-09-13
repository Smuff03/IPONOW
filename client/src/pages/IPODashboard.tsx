import { useEffect, useMemo, useState } from "react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SearchBar } from "@/components/SearchBar";
import { StatusTabs, SortSelect, type SortKey } from "@/components/FilterBar";
import { IPOTable } from "@/components/IPOTable";
import { Pagination } from "@/components/Pagination";
import { AdBanner } from "@/components/AdBanner";
import { TableRowSkeleton } from "@/components/LoadingSkeleton";
import { ErrorState } from "@/components/ErrorState";
import { useDebounce } from "@/hooks/useDebounce";
import { getIpos } from "@/services/ipoApi";
import type { IPO, IPOStatus } from "@/types/ipo";

const PAGE_SIZE = 6;

export function IPODashboard() {
  const [status, setStatus] = useState<IPOStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [page, setPage] = useState(1);
  const [ipos, setIpos] = useState<IPO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 250);

  const load = () => {
    setIpos(null);
    setError(null);
    getIpos({ status, search: debouncedSearch })
      .then(setIpos)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load IPOs"));
    setPage(1);
  };

  useEffect(load, [status, debouncedSearch]);

  const sorted = useMemo(() => {
    if (!ipos) return null;
    const arr = [...ipos];
    switch (sort) {
      case "gmp":
        return arr.sort((a, b) => b.gmp - a.gmp);
      case "priceBand":
        return arr.sort((a, b) => b.priceBandMax - a.priceBandMax);
      case "subscription":
        return arr.sort((a, b) => b.expectedSubscriptionX - a.expectedSubscriptionX);
      default:
        return arr.sort((a, b) => +new Date(b.openDate) - +new Date(a.openDate));
    }
  }, [ipos, sort]);

  const totalPages = sorted ? Math.max(1, Math.ceil(sorted.length / PAGE_SIZE)) : 1;
  const pageItems = sorted?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) ?? null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Seo
        title="IPO dashboard — all IPOs, GMP, subscription and status"
        description="Browse all mainboard and SME IPOs with live grey market premium, price band, expected subscription and status. Search, filter and sort."
        canonicalPath="/ipos"
      />
      <Breadcrumbs items={[{ label: "IPOs" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold">IPO dashboard</h1>
      <p className="mt-1 text-ink-soft">All mainboard and SME issues in one searchable, sortable table.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StatusTabs value={status} onChange={setStatus} />
        <div className="flex gap-2">
          <SearchBar value={search} onChange={setSearch} />
          <SortSelect value={sort} onChange={setSort} />
        </div>
      </div>

      <div className="mt-6">
        {error ? (
          <ErrorState message={error} onRetry={load} />
        ) : pageItems ? (
          <IPOTable ipos={pageItems} />
        ) : (
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line">
            <table className="w-full">
              <tbody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {sorted && sorted.length > 0 && (
        <div className="mt-6">
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </div>
      )}

      <div className="mt-8">
        <AdBanner slot="in-feed" />
      </div>
    </div>
  );
}
