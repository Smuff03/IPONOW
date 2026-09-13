import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { AdBanner } from "@/components/AdBanner";
import { IPOCard } from "@/components/IPOCard";
import { ArticleCard } from "@/components/ArticleCard";
import { IPOListSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/ErrorState";
import { GMPBadge } from "@/components/GMPBadge";
import { Button } from "@/components/ui/button";
import { getUpcomingIpos, getOpenIpos, getRecentlyClosed, getGmpLeaders, getArticles } from "@/services/ipoApi";
import type { IPO, Article } from "@/types/ipo";
import { ALLOTMENT_LINKS } from "@/data/mockReviews";
import { CheckCircle2 } from "lucide-react";

const FAQS = [
  {
    q: "What is IPO GMP (grey market premium)?",
    a: "GMP is the unofficial premium at which IPO shares are traded before listing, in a market outside exchange regulation. It's a widely tracked sentiment indicator, not a guarantee of listing price.",
  },
  {
    q: "How often is GMP updated on Greenshoe?",
    a: "Grey market premium and IPO status are refreshed every 30 minutes while an issue is open, sourced from configured data providers. Each figure carries a source and last-updated timestamp.",
  },
  {
    q: "How do I check my IPO allotment status?",
    a: "Visit the Allotment page and use the registrar link for your issue, or check directly via BSE/NSE using your PAN, application number, or demat account number.",
  },
  {
    q: "Are the reviews on this site genuine?",
    a: "Yes. We aggregate publicly available sentiment from permitted sources and always display the source, review count and last-updated time. We never fabricate reviews.",
  },
];

export function Home() {
  const [upcoming, setUpcoming] = useState<IPO[] | null>(null);
  const [open, setOpen] = useState<IPO[] | null>(null);
  const [closed, setClosed] = useState<IPO[] | null>(null);
  const [gmpLeaders, setGmpLeaders] = useState<IPO[] | null>(null);
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    getUpcomingIpos(3).then(setUpcoming);
    getOpenIpos().then(setOpen);
    getRecentlyClosed(3).then(setClosed);
    getGmpLeaders(6).then(setGmpLeaders);
    getArticles().then((a) => setArticles(a.slice(0, 3)));
  }, []);

  return (
    <>
      <Seo
        title="Live IPO GMP, subscription and allotment tracker"
        description="Track live IPO grey market premium, subscription numbers, price bands, allotment status and analysis for mainboard and SME IPOs."
        canonicalPath="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Greenshoe",
          url: "https://greenshoe.example.com",
        }}
      />

      {/* Hero */}
      <section className="border-b border-line bg-gradient-to-b from-brand-soft/60 to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="max-w-2xl">
            <p className="font-mono-data text-xs uppercase text-brand">Independent IPO intelligence</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Every IPO number, tracked and sourced.
            </h1>
            <p className="mt-4 text-lg text-ink-soft">
              Grey market premium, subscription data, price bands and allotment status for mainboard and SME IPOs —
              refreshed on a schedule, every figure timestamped and attributed.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/ipos">
                <Button size="md">Open IPO dashboard</Button>
              </Link>
              <Link to="/allotment">
                <Button size="md" variant="outline">
                  Check allotment status
                </Button>
              </Link>
            </div>
          </div>

          {/* GMP ticker */}
          {gmpLeaders && gmpLeaders.length > 0 && (
            <div className="relative mt-10 overflow-hidden rounded-lg border border-line bg-paper-raised">
              <div className="flex w-max animate-ticker gap-8 whitespace-nowrap px-4 py-3">
                {[...gmpLeaders, ...gmpLeaders].map((ipo, i) => (
                  <Link key={i} to={`/ipo/${ipo.slug}`} className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{ipo.company}</span>
                    <GMPBadge gmp={ipo.gmp} trend={ipo.gmpTrend} size="sm" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6">
        {/* Summary cards */}
        <section className="grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Open for bidding" value={open?.length ?? "—"} tone="brand" />
          <SummaryCard label="Upcoming this month" value={upcoming ? upcoming.length + 5 : "—"} tone="gold" />
          <SummaryCard label="Listed in last 30 days" value={closed ? closed.length + 4 : "—"} tone="ink" />
        </section>

        {/* Open IPOs */}
        <Section title="Open for subscription" viewAllHref="/ipos">
          {open ? (
            open.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {open.map((ipo) => (
                  <IPOCard key={ipo.id} ipo={ipo} />
                ))}
              </div>
            ) : (
              <EmptyState title="No IPOs open right now" message="Check back soon, or browse upcoming issues below." />
            )
          ) : (
            <IPOListSkeleton count={3} />
          )}
        </Section>

        <AdBanner slot="in-feed" />

        {/* Upcoming IPOs */}
        <Section title="Upcoming IPOs" viewAllHref="/ipos">
          {upcoming ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((ipo) => (
                <IPOCard key={ipo.id} ipo={ipo} />
              ))}
            </div>
          ) : (
            <IPOListSkeleton count={3} />
          )}
        </Section>

        {/* Recently closed / GMP tracker */}
        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Section title="Recently listed" viewAllHref="/ipos">
              {closed ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {closed.map((ipo) => (
                    <IPOCard key={ipo.id} ipo={ipo} />
                  ))}
                </div>
              ) : (
                <IPOListSkeleton count={2} />
              )}
            </Section>
          </div>
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold">GMP tracker</h2>
            <div className="space-y-2 rounded-[var(--radius-card)] border border-line bg-paper-raised p-3">
              {gmpLeaders?.map((ipo) => (
                <Link
                  key={ipo.id}
                  to={`/ipo/${ipo.slug}`}
                  className="flex items-center justify-between rounded-md px-2 py-2 text-sm hover:bg-ink/5"
                >
                  <span className="truncate pr-2">{ipo.company}</span>
                  <GMPBadge gmp={ipo.gmp} trend={ipo.gmpTrend} size="sm" />
                </Link>
              )) ?? <IPOListSkeleton count={4} />}
            </div>
          </div>
        </section>

        {/* Articles */}
        <Section title="Latest articles" viewAllHref="/articles">
          {articles ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <IPOListSkeleton count={3} />
          )}
        </Section>

        {/* Allotment */}
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold">Check allotment status</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ALLOTMENT_LINKS.slice(0, 3).map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="flex items-start gap-3 rounded-[var(--radius-card)] border border-line bg-paper-raised p-4 hover:shadow-md"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <div>
                  <p className="font-medium">{link.registrar}</p>
                  <p className="text-xs text-ink-soft">{link.note}</p>
                </div>
              </a>
            ))}
          </div>
          <Link to="/allotment" className="mt-4 inline-block text-sm font-medium text-brand hover:underline">
            View full allotment guide
          </Link>
        </section>

        <AdBanner slot="in-feed" />

        {/* FAQ */}
        <section>
          <h2 className="mb-4 font-display text-xl font-semibold">Frequently asked questions</h2>
          <div className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-paper-raised">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group p-4">
                <summary className="cursor-pointer list-none font-medium marker:content-none">
                  <span className="flex items-center justify-between">
                    {faq.q}
                    <span className="text-ink-soft transition-transform group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-2 text-sm text-ink-soft">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function Section({ title, viewAllHref, children }: { title: string; viewAllHref: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">{title}</h2>
        <Link to={viewAllHref} className="text-sm font-medium text-brand hover:underline">
          View all
        </Link>
      </div>
      {children}
    </section>
  );
}

function SummaryCard({ label, value, tone }: { label: string; value: number | string; tone: "brand" | "gold" | "ink" }) {
  const toneClass = tone === "brand" ? "text-brand" : tone === "gold" ? "text-gold" : "text-ink";
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-paper-raised p-5">
      <p className={`font-mono-data text-3xl font-semibold ${toneClass}`}>{value}</p>
      <p className="mt-1 text-sm text-ink-soft">{label}</p>
    </div>
  );
}
