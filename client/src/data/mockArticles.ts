import type { Article } from "@/types/ipo";

const now = new Date();
const iso = (daysAgo: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

// Placeholder editorial content for local development. Production articles are
// ingested via server/src/services/articleService.ts with full source attribution.
export const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "Solara Energy Systems IPO: GMP jumps 18% on final subscription day",
    slug: "solara-energy-systems-gmp-jumps-final-day",
    excerpt: "Grey market premium for Solara Energy Systems climbed as institutional demand picked up on day three.",
    content:
      "Grey market premium for Solara Energy Systems climbed through the final day of bidding as institutional investors placed larger orders than in the first two sessions. Analysts tracking the issue noted that anchor allocation and qualified institutional buyer demand are typically the strongest signal of listing-day performance, though grey market premium remains an unofficial and unregulated indicator that should be treated with caution rather than as a guarantee of listing gains.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop",
    category: "gmp-update",
    publishedAt: iso(0),
    updatedAt: iso(0),
    status: "published",
    relatedIpoSlugs: ["solara-energy-systems-ipo"],
    source: "Mock Editorial",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(0),
  },
  {
    id: "a2",
    title: "Five upcoming IPOs to watch this month",
    slug: "five-upcoming-ipos-to-watch-this-month",
    excerpt: "A look at the mainboard and SME issues opening for subscription over the next few weeks.",
    content:
      "The primary market calendar remains busy, with a mix of mainboard and SME issues expected to open over the coming weeks. Sectors represented include digital payments, aerospace components and hospitality, spanning a range of issue sizes. As always, prospective investors are encouraged to read the red herring prospectus in full and consider risk factors rather than relying solely on subscription figures or grey market chatter.",
    image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format&fit=crop",
    category: "analysis",
    publishedAt: iso(1),
    updatedAt: iso(1),
    status: "published",
    relatedIpoSlugs: ["kestrel-digital-payments-ipo", "corvid-aerospace-components-ipo", "marisol-hospitality-ipo"],
    source: "Mock Editorial",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(1),
  },
  {
    id: "a3",
    title: "How IPO allotment actually works: a step-by-step guide",
    slug: "how-ipo-allotment-works-guide",
    excerpt: "Understand the allotment process, from basis of allotment to demat credit, in plain language.",
    content:
      "IPO allotment follows a defined process regulated by the exchanges and the registrar appointed for the issue. Once bidding closes, the registrar reconciles all valid applications and applies a basis of allotment approved by the stock exchanges, prioritising retail applicants for at least one lot where oversubscription rules allow. Shares are credited to demat accounts ahead of the listing date, and refunds for unallotted or partially allotted applications are processed shortly after.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1200&auto=format&fit=crop",
    category: "allotment-guide",
    publishedAt: iso(3),
    updatedAt: iso(2),
    status: "published",
    source: "Mock Editorial",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(2),
  },
  {
    id: "a4",
    title: "Kestrel Digital Payments files for ₹2,100 Cr IPO",
    slug: "kestrel-digital-payments-files-2100cr-ipo",
    excerpt: "The merchant payments platform plans to use proceeds for working-capital lending and technology investment.",
    content:
      "Kestrel Digital Payments has filed its draft red herring prospectus for a public issue expected to raise approximately ₹2,100 Cr. According to the filing, a portion of the proceeds is earmarked for expanding the company's working-capital lending book to small merchants, with the remainder allocated to technology infrastructure and general corporate purposes.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop",
    category: "news",
    publishedAt: iso(6),
    updatedAt: iso(6),
    status: "published",
    relatedIpoSlugs: ["kestrel-digital-payments-ipo"],
    source: "Mock Editorial",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(6),
  },
  {
    id: "a5",
    title: "Understanding grey market premium: what it is and what it isn't",
    slug: "understanding-grey-market-premium-guide",
    excerpt: "GMP is a widely watched but entirely unofficial indicator. Here's what it can and can't tell you.",
    content:
      "Grey market premium refers to the price at which IPO shares change hands informally before listing, in a market that operates outside any exchange or regulatory oversight. While it is often used as a proxy for expected listing gains, GMP figures are unverified, can be thinly traded, and have in many cases diverged sharply from actual listing-day prices. Investors are advised to treat GMP as one data point among many rather than a reliable forecast.",
    image: "https://images.unsplash.com/photo-1560221328-12fe60f83ab8?q=80&w=1200&auto=format&fit=crop",
    category: "guide",
    publishedAt: iso(10),
    updatedAt: iso(8),
    status: "published",
    source: "Mock Editorial",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(8),
  },
  {
    id: "a6",
    title: "Ferrowave Industries lists at 38% premium over issue price",
    slug: "ferrowave-industries-lists-38-percent-premium",
    excerpt: "The SME issue saw strong retail demand throughout its three-day bidding window.",
    content:
      "Ferrowave Industries shares listed at a premium of roughly 38% over the issue price, in line with the strong subscription numbers seen across investor categories during bidding. Retail portions were subscribed multiple times over, while the non-institutional investor category recorded the highest oversubscription of the issue.",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?q=80&w=1200&auto=format&fit=crop",
    category: "news",
    publishedAt: iso(0),
    updatedAt: iso(0),
    status: "published",
    relatedIpoSlugs: ["ferrowave-industries-ipo"],
    source: "Mock Editorial",
    sourceUrl: "https://example.com/mock",
    lastUpdated: iso(0),
  },
];
