// Normalizes raw JSON from the Express API (Prisma uppercase enums, Decimal
// strings, relation objects) into the shapes client/src/types/ipo.ts and the
// components expect (lowercase enums, renamed/flattened fields).
//
// Why this exists: the backend intentionally mirrors its Postgres schema
// (UPCOMING/OPEN/..., UP/DOWN/FLAT, MAINBOARD/SME, Decimal-as-string issue
// sizes) while the UI was designed against lowercase string unions and a
// couple of renamed fields (e.g. `expectedSubscriptionX`). Without this
// mapping, switching `USE_LIVE_API` to `true` renders correctly-fetched live
// data as blank/crashed rows, which is why live data looked "unreliable."

import type {
  IPO,
  IPOStatus,
  GMPTrend,
  IPOType,
  Article,
  Review,
  SentimentLabel,
} from "@/types/ipo";

const STALE_MS = 60 * 60 * 1000; // 60 minutes — matches server ingestGmp() staleThreshold
const UNAVAILABLE_MS = 3 * 60 * 60 * 1000; // 3 hours

export function toDataStatus(lastUpdated: string | null | undefined): "live" | "stale" | "unavailable" {
  if (!lastUpdated) return "unavailable";
  const age = Date.now() - new Date(lastUpdated).getTime();
  if (age > UNAVAILABLE_MS) return "unavailable";
  if (age > STALE_MS) return "stale";
  return "live";
}

function num(value: unknown, fallback = 0): number {
  if (value == null) return fallback;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isNaN(n) ? fallback : n;
}

function str(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

export function mapIpo(raw: Record<string, unknown>): IPO {
  const gmpObj = raw.gmp as Record<string, unknown> | undefined;

  const getGmpValue = () => {
    if (typeof raw.gmp === 'number') return num(raw.gmp);
    if (gmpObj && gmpObj.price) return num(gmpObj.price);
    return 0;
  };

  const lastUpdatedRaw = gmpObj?.updated_at ?? raw.lastUpdated;
  const lastUpdated = str(lastUpdatedRaw, new Date().toISOString());

  const gmpHistoryRaw = Array.isArray(raw.gmpHistory) ? (raw.gmpHistory as Record<string, unknown>[]) : [];
  const subscriptionsRaw = Array.isArray(raw.subscriptions) ? (raw.subscriptions as Record<string, unknown>[]) : [];

  return {
    id: str(raw.slug ?? raw.id),
    name: str(raw.display_name ?? raw.name),
    slug: str(raw.slug),
    company: str(raw.company ?? raw.display_name ?? raw.name),
    logo: raw.logo ? str(raw.logo) : undefined,
    type: str(raw.type ?? raw.sub_type, "MAINBOARD").toLowerCase() as IPOType,
    priceBandMin: num(raw.price_min ?? raw.priceBandMin),
    priceBandMax: num(raw.price_max ?? raw.priceBandMax),
    lotSize: num(raw.lot_size ?? raw.lotSize),
    issueSizeCr: num(raw.issue_size ?? raw.issueSizeCr),
    gmp: getGmpValue(),
    gmpTrend: str(raw.gmpTrend, "FLAT").toLowerCase() as GMPTrend,
    gmpHistory: gmpHistoryRaw.map((p) => ({ timestamp: str(p.timestamp), gmp: num(p.gmp) })),
    expectedSubscriptionX: num(raw.subscription_total ?? raw.expectedSubscription),
    estimatedListing: num(gmpObj?.estimated_listing_price ?? raw.estimatedListing),
    openDate: str(raw.open_date ?? raw.openDate),
    closeDate: str(raw.close_date ?? raw.closeDate),
    allotmentDate: str(raw.allotment_date ?? raw.allotmentDate),
    refundDate: str(raw.refund_date ?? raw.refundDate),
    demateDate: str(raw.demate_date ?? raw.demateDate),
    listingDate: str(raw.listing_date ?? raw.listingDate),
    status: str(raw.status, "UPCOMING").toLowerCase().replace(/ /g, "_") as IPOStatus,
    registrar: str(raw.registrar),
    registrarUrl: str(raw.registrarUrl),
    leadManagers: Array.isArray(raw.leadManagers) ? (raw.leadManagers as string[]) : [],
    subscriptionHistory: subscriptionsRaw.map((s) => ({
      day: num(s.day, 1),
      date: str(s.timestamp),
      qib: num(s.qib),
      nii: num(s.nii),
      retail: num(s.retail),
      employee: s.employee == null ? null : num(s.employee),
      total: num(s.total),
    })),
    about: str(raw.about),
    strengths: Array.isArray(raw.strengths) ? (raw.strengths as string[]) : [],
    risks: Array.isArray(raw.risks) ? (raw.risks as string[]) : [],
    source: str(raw.source, "IPO Guru"),
    sourceUrl: str(raw.web_url ?? raw.sourceUrl),
    lastUpdated,
    dataStatus: toDataStatus(lastUpdated),
  };
}

export function mapArticle(raw: Record<string, unknown>): Article {
  const lastUpdated = str(raw.lastUpdated ?? raw.updatedAt, new Date().toISOString());
  const relatedIpos = Array.isArray(raw.relatedIpos) ? (raw.relatedIpos as Record<string, unknown>[]) : [];
  return {
    id: str(raw.id),
    title: str(raw.title),
    slug: str(raw.slug),
    excerpt: str(raw.excerpt),
    content: str(raw.content),
    image: str(raw.image),
    category: str(raw.category, "NEWS").toLowerCase().replace(/_/g, "-") as Article["category"],
    source: str(raw.source),
    sourceUrl: str(raw.sourceUrl),
    lastUpdated,
    dataStatus: toDataStatus(lastUpdated),
    publishedAt: str(raw.publishedAt),
    updatedAt: str(raw.updatedAt),
    status: str(raw.status, "DRAFT").toLowerCase() as Article["status"],
    relatedIpoSlugs: relatedIpos.map((i) => str(i.slug)),
  };
}

export function mapReview(raw: Record<string, unknown>): Review {
  const lastUpdated = str(raw.lastUpdated, new Date().toISOString());
  const ipo = (raw.ipo ?? {}) as Record<string, unknown>;
  return {
    id: str(raw.id),
    ipoSlug: str(ipo.slug ?? raw.ipoSlug),
    ipoName: str(ipo.name ?? raw.ipoName),
    sentiment: str(raw.sentiment, "NEUTRAL").toLowerCase() as SentimentLabel,
    positivePct: num(raw.positivePct),
    neutralPct: num(raw.neutralPct),
    negativePct: num(raw.negativePct),
    reviewCount: num(raw.reviewCount),
    publishedAt: str(raw.publishedAt),
    source: str(raw.source),
    sourceUrl: str(raw.sourceUrl),
    lastUpdated,
    dataStatus: toDataStatus(lastUpdated),
  };
}
