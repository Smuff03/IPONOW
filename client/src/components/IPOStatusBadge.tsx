import type { IPOStatus } from "@/types/ipo";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<IPOStatus, { label: string; className: string }> = {
  upcoming: { label: "Upcoming", className: "bg-gold-soft text-gold border-gold/30" },
  open: { label: "Open", className: "bg-brand-soft text-brand border-brand/30" },
  closing_today: { label: "Closing today", className: "bg-down/10 text-down border-down/30" },
  closed: { label: "Closed", className: "bg-ink-soft/10 text-ink-soft border-line" },
  listed: { label: "Listed", className: "bg-ink/5 text-ink-soft border-line" },
};

export function IPOStatusBadge({ status, className }: { status: IPOStatus; className?: string }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        cfg.className,
        className
      )}
    >
      {status === "closing_today" && <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-down opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-down" />
      </span>}
      {cfg.label}
    </span>
  );
}
