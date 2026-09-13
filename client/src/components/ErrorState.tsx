import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./ui/button";

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this data. Please try again.",
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius-card)] border border-line bg-paper-raised px-6 py-12 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-down/10 text-down">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display font-semibold">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-ink-soft">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="h-3.5 w-3.5" /> Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-line px-6 py-12 text-center">
      <p className="font-display font-semibold text-ink-soft">{title}</p>
      {message && <p className="max-w-sm text-sm text-ink-soft">{message}</p>}
    </div>
  );
}
