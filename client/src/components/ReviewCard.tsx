import { Link } from "react-router-dom";
import type { Review } from "@/types/ipo";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const SENTIMENT_STYLE: Record<Review["sentiment"], string> = {
  positive: "text-up bg-up/10",
  neutral: "text-flat bg-flat/10",
  negative: "text-down bg-down/10",
};

export function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-paper-raised p-4">
      <div className="flex items-start justify-between gap-2">
        <Link to={`/ipo/${review.ipoSlug}`} className="font-display font-semibold hover:text-brand">
          {review.ipoName}
        </Link>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium capitalize", SENTIMENT_STYLE[review.sentiment])}>
          {review.sentiment}
        </span>
      </div>

      <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-line/60">
        <div className="bg-up" style={{ width: `${review.positivePct}%` }} title={`Positive ${review.positivePct}%`} />
        <div className="bg-flat" style={{ width: `${review.neutralPct}%` }} title={`Neutral ${review.neutralPct}%`} />
        <div className="bg-down" style={{ width: `${review.negativePct}%` }} title={`Negative ${review.negativePct}%`} />
      </div>
      <div className="mt-1.5 flex justify-between text-[11px] text-ink-soft">
        <span>{review.positivePct}% positive</span>
        <span>{review.negativePct}% negative</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
        <span>{review.reviewCount.toLocaleString("en-IN")} reviews aggregated</span>
        <span>{formatDate(review.publishedAt)}</span>
      </div>
      <p className="mt-1 text-[11px] text-ink-soft/70">
        Source: {review.source} {review.dataStatus === "stale" && "· showing last known data"}
      </p>
    </div>
  );
}
