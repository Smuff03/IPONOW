export type IPOStatus = "upcoming" | "open" | "closing_today" | "closed" | "listed";
export type GMPTrend = "up" | "down" | "flat";
export type IPOType = "mainboard" | "sme";

export interface SourceMeta {
  source: string;
  sourceUrl: string;
  lastUpdated: string; // ISO date
  dataStatus?: "live" | "stale" | "unavailable";
}

export interface GMPPoint {
  timestamp: string;
  gmp: number;
}

export interface SubscriptionDay {
  day: number;
  date: string;
  qib: number;
  nii: number;
  retail: number;
  employee: number | null;
  total: number;
}

export interface IPO extends SourceMeta {
  id: string;
  name: string;
  slug: string;
  company: string;
  logo?: string;
  type: IPOType;
  priceBandMin: number;
  priceBandMax: number;
  lotSize: number;
  issueSizeCr: number; // in crores
  gmp: number;
  gmpTrend: GMPTrend;
  gmpHistory: GMPPoint[];
  expectedSubscriptionX: number;
  estimatedListing: number;
  openDate: string;
  closeDate: string;
  allotmentDate: string;
  refundDate: string;
  demateDate: string;
  listingDate: string;
  status: IPOStatus;
  registrar: string;
  registrarUrl: string;
  leadManagers: string[];
  subscriptionHistory: SubscriptionDay[];
  about: string;
  strengths: string[];
  risks: string[];
  financials?: { year: string; revenueCr: number; profitCr: number }[];
}

export interface Article extends SourceMeta {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: "news" | "analysis" | "gmp-update" | "guide" | "allotment-guide";
  publishedAt: string;
  updatedAt: string;
  status: "published" | "draft";
  relatedIpoSlugs?: string[];
}

export type SentimentLabel = "positive" | "neutral" | "negative";

export interface Review extends SourceMeta {
  id: string;
  ipoSlug: string;
  ipoName: string;
  sentiment: SentimentLabel;
  positivePct: number;
  neutralPct: number;
  negativePct: number;
  reviewCount: number;
  publishedAt: string;
}

export interface AllotmentLink {
  id: string;
  registrar: string;
  url: string;
  ipoSlug?: string;
  note?: string;
}
