import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ReviewCard } from "@/components/ReviewCard";
import { AdBanner } from "@/components/AdBanner";
import { IPOListSkeleton } from "@/components/LoadingSkeleton";
import { getReviews } from "@/services/ipoApi";
import type { Review } from "@/types/ipo";

export function Reviews() {
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    getReviews().then(setReviews);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Seo
        title="IPO reviews & investor sentiment"
        description="Aggregated public sentiment for recent and upcoming IPOs: positive, neutral and negative review breakdown, sourced and timestamped."
        canonicalPath="/reviews"
      />
      <Breadcrumbs items={[{ label: "Reviews" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold">Reviews & sentiment</h1>
      <p className="mt-1 max-w-2xl text-ink-soft">
        Aggregated sentiment from publicly available sources, permitted for reuse. We never fabricate reviews — every
        card links back to its source and shows when it was last refreshed.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {reviews ? reviews.map((r) => <ReviewCard key={r.id} review={r} />) : <IPOListSkeleton count={4} />}
      </div>

      <div className="mt-8">
        <AdBanner slot="in-feed" />
      </div>
    </div>
  );
}
