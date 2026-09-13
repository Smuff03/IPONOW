import { cn } from "@/lib/utils";
import type { IPOStatus } from "@/types/ipo";

export type SortKey = "date" | "gmp" | "priceBand" | "subscription";

const STATUS_TABS: { key: IPOStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "open", label: "Open" },
  { key: "closed", label: "Closed" },
  { key: "listed", label: "Listed" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "gmp", label: "GMP" },
  { key: "priceBand", label: "Price band" },
  { key: "subscription", label: "Subscription" },
];

export function StatusTabs({ value, onChange }: { value: IPOStatus | "all"; onChange: (v: IPOStatus | "all") => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-lg bg-ink/5 p-1">
      {STATUS_TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === tab.key ? "bg-paper-raised text-ink shadow-sm" : "text-ink-soft hover:text-ink"
          )}
          aria-pressed={value === tab.key}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function SortSelect({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortKey)}
      className="h-10 rounded-lg border border-line bg-paper-raised px-3 text-sm"
      aria-label="Sort by"
    >
      {SORT_OPTIONS.map((opt) => (
        <option key={opt.key} value={opt.key}>
          Sort: {opt.label}
        </option>
      ))}
    </select>
  );
}
