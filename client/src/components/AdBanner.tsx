import { cn } from "@/lib/utils";

type AdSlot = "leaderboard" | "in-feed" | "sidebar" | "in-article" | "mobile-strip";

const SLOT_DIMENSIONS: Record<AdSlot, string> = {
  leaderboard: "h-[90px] w-full max-w-[728px]",
  "in-feed": "h-24 w-full",
  sidebar: "h-[600px] w-full max-w-[300px]",
  "in-article": "h-24 w-full",
  "mobile-strip": "h-[60px] w-full",
};

/**
 * Reusable AdSense-ready placeholder. Swap the placeholder <div> below for the
 * real <ins class="adsbygoogle" ...> unit once an AdSense account is approved,
 * and load the AdSense script once in index.html (see README "AdSense setup").
 * Keeping ad slots as a single component makes it trivial to add/remove
 * placements without touching page layouts, and to disable ads globally
 * (e.g. for logged-in subscribers) from one place.
 */
export function AdBanner({ slot, className, label = "Advertisement" }: { slot: AdSlot; className?: string; label?: string }) {
  return (
    <div
      className={cn(
        "mx-auto flex items-center justify-center rounded-md border border-dashed border-line bg-ink/[0.03] text-[11px] text-ink-soft/60",
        SLOT_DIMENSIONS[slot],
        className
      )}
      data-ad-slot={slot}
      role="complementary"
      aria-label={label}
    >
      {label} · {slot}
    </div>
  );
}
