import type { Review, AllotmentLink } from "@/types/ipo";

const now = new Date();
const iso = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

// Placeholder aggregate sentiment for local development only. In production this
// is populated by server/src/services/reviewService.ts, which only aggregates
// counts/labels permitted by each source's terms of use and never republishes
// full third-party review text.
export const REVIEWS: Review[] = [
  {
    id: "r1",
    ipoSlug: "solara-energy-systems-ipo",
    ipoName: "Solara Energy Systems IPO",
    sentiment: "positive",
    positivePct: 68,
    neutralPct: 22,
    negativePct: 10,
    reviewCount: 412,
    publishedAt: iso(0),
    source: "Mock Aggregator",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(0),
    dataStatus: "live",
  },
  {
    id: "r2",
    ipoSlug: "vantic-pharma-ipo",
    ipoName: "Vantic Pharma IPO",
    sentiment: "neutral",
    positivePct: 34,
    neutralPct: 44,
    negativePct: 22,
    reviewCount: 187,
    publishedAt: iso(0),
    source: "Mock Aggregator",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(0),
    dataStatus: "live",
  },
  {
    id: "r3",
    ipoSlug: "kestrel-digital-payments-ipo",
    ipoName: "Kestrel Digital Payments IPO",
    sentiment: "positive",
    positivePct: 74,
    neutralPct: 18,
    negativePct: 8,
    reviewCount: 903,
    publishedAt: iso(1),
    source: "Mock Aggregator",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(1),
    dataStatus: "live",
  },
  {
    id: "r4",
    ipoSlug: "trellis-retail-ventures-ipo",
    ipoName: "Trellis Retail Ventures IPO",
    sentiment: "negative",
    positivePct: 18,
    neutralPct: 30,
    negativePct: 52,
    reviewCount: 265,
    publishedAt: iso(2),
    source: "Mock Aggregator",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(2),
    dataStatus: "stale",
  },
  {
    id: "r5",
    ipoSlug: "corvid-aerospace-components-ipo",
    ipoName: "Corvid Aerospace Components IPO",
    sentiment: "positive",
    positivePct: 61,
    neutralPct: 29,
    negativePct: 10,
    reviewCount: 96,
    publishedAt: iso(3),
    source: "Mock Aggregator",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(3),
    dataStatus: "live",
  },
];

export const ALLOTMENT_LINKS: AllotmentLink[] = [
  {
    id: "al1",
    registrar: "Kfin Technologies Ltd",
    url: "https://kfintech.com/ipostatus/",
    note: "Check status for issues registered with Kfin",
  },
  {
    id: "al2",
    registrar: "Link Intime India Pvt Ltd",
    url: "https://linkintime.co.in/initial_offer/public-issues.html",
    note: "Check status for issues registered with Link Intime",
  },
  {
    id: "al3",
    registrar: "Bigshare Services Pvt Ltd",
    url: "https://ipo.bigshareonline.com/ipo_status.html",
    note: "Check status for issues registered with Bigshare",
  },
  {
    id: "al4",
    registrar: "BSE",
    url: "https://www.bseindia.com/investors/appli_check.aspx",
    note: "Check allotment status via BSE using application number or PAN",
  },
  {
    id: "al5",
    registrar: "NSE",
    url: "https://www.nseindia.com/invest/initial-public-offerings",
    note: "General information on live and upcoming NSE-listed IPOs",
  },
];
