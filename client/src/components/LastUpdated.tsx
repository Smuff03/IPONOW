import { Clock } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function LastUpdated({ iso, source, className }: { iso: string; source?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs text-ink-soft", className)} title={new Date(iso).toLocaleString()}>
      <Clock className="h-3 w-3" />
      Updated {formatRelativeTime(iso)}
      {source && <span className="text-ink-soft/70">· {source}</span>}
    </span>
  );
}
