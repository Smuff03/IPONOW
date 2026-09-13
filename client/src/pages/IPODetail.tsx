import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { IPOStatusBadge } from "@/components/IPOStatusBadge";
import { GMPBadge } from "@/components/GMPBadge";
import { GMPChart } from "@/components/GMPChart";
import { SubscriptionBar } from "@/components/SubscriptionBar";
import { LastUpdated } from "@/components/LastUpdated";
import { AdBanner } from "@/components/AdBanner";
import { ArticleCard } from "@/components/ArticleCard";
import { IPOCard } from "@/components/IPOCard";
import { ErrorState } from "@/components/ErrorState";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getIpoBySlug, getIpos, getArticles } from "@/services/ipoApi";
import { formatDate, formatCurrency } from "@/lib/utils";
import type { IPO, Article } from "@/types/ipo";
import { AlertTriangle } from "lucide-react";

export function IPODetail() {
  const { slug = "" } = useParams();
  const [ipo, setIpo] = useState<IPO | null | undefined>(null);
  const [related, setRelated] = useState<IPO[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    let active = true;
    setIpo(null);
    getIpoBySlug(slug).then((result) => {
      if (!active) return;
      setIpo(result ?? undefined);
    });
    getIpos().then((all) => {
      if (!active) return;
      setRelated(all.filter((i) => i.slug !== slug).slice(0, 3));
    });
    getArticles().then((all) => {
      if (!active) return;
      setArticles(all.filter((a) => a.relatedIpoSlugs?.includes(slug)).slice(0, 3));
    });
    return () => {
      active = false;
    };
  }, [slug]);

  if (ipo === undefined) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <ErrorState title="IPO not found" message="This IPO may have been removed or the link is incorrect." />
      </div>
    );
  }

  if (!ipo) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const importantDates: { label: string; date: string }[] = [
    { label: "Open date", date: ipo.openDate },
    { label: "Close date", date: ipo.closeDate },
    { label: "Allotment date", date: ipo.allotmentDate },
    { label: "Refund initiation", date: ipo.refundDate },
    { label: "Demat credit", date: ipo.demateDate },
    { label: "Listing date", date: ipo.listingDate },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Seo
        title={`${ipo.name} — GMP, price band, dates & subscription`}
        description={`${ipo.company} IPO: grey market premium ₹${ipo.gmp}, price band ₹${ipo.priceBandMin}-${ipo.priceBandMax}, ${ipo.status} status. Subscription, allotment and listing dates.`}
        canonicalPath={`/ipo/${ipo.slug}`}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "IPOs", item: "https://greenshoe.example.com/ipos" },
              { "@type": "ListItem", position: 2, name: ipo.name, item: `https://greenshoe.example.com/ipo/${ipo.slug}` },
            ],
          },
        ]}
      />
      <Breadcrumbs items={[{ label: "IPOs", href: "/ipos" }, { label: ipo.name }]} />

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold">{ipo.name}</h1>
          <p className="mt-1 text-ink-soft">{ipo.company}</p>
        </div>
        <IPOStatusBadge status={ipo.status} className="mt-1" />
      </div>
      <div className="mt-2">
        <LastUpdated iso={ipo.lastUpdated} source={ipo.source} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Key stats */}
          <Card>
            <CardContent className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3">
              <Stat label="Price band" value={`₹${ipo.priceBandMin}–${ipo.priceBandMax}`} />
              <Stat label="Lot size" value={`${ipo.lotSize} shares`} />
              <Stat
                label="Min. investment"
                value={formatCurrency(ipo.lotSize * ipo.priceBandMax)}
              />
              <Stat label="Issue size" value={`₹${ipo.issueSizeCr.toLocaleString("en-IN")} Cr`} />
              <Stat label="IPO type" value={ipo.type === "mainboard" ? "Mainboard" : "SME"} />
              <Stat label="Expected subscription" value={`${ipo.expectedSubscriptionX.toFixed(1)}x`} />
            </CardContent>
          </Card>

          {/* GMP */}
          <Card>
            <CardHeader>
              <CardTitle>Grey market premium</CardTitle>
              <GMPBadge gmp={ipo.gmp} trend={ipo.gmpTrend} />
            </CardHeader>
            <CardContent>
              <GMPChart data={ipo.gmpHistory} />
              <p className="mt-3 flex items-center gap-1 text-xs text-ink-soft">
                Estimated listing price: <span className="font-mono-data font-medium text-ink">{formatCurrency(ipo.estimatedListing)}</span>
              </p>
            </CardContent>
          </Card>

          {/* Subscription */}
          {ipo.subscriptionHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Day-wise subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {ipo.subscriptionHistory.map((day) => (
                  <div key={day.day}>
                    <p className="mb-2 text-xs font-medium text-ink-soft">
                      Day {day.day} · {formatDate(day.date)}
                    </p>
                    <SubscriptionBar qib={day.qib} nii={day.nii} retail={day.retail} employee={day.employee} total={day.total} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About the company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-ink-soft">{ipo.about}</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium">Strengths</p>
                  <ul className="space-y-1.5 text-sm text-ink-soft">
                    {ipo.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-up">+</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium">Risk factors</p>
                  <ul className="space-y-1.5 text-sm text-ink-soft">
                    {ipo.risks.map((r, i) => (
                      <li key={i} className="flex gap-2">
                        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-down" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {ipo.financials && (
                <div>
                  <p className="mb-2 text-sm font-medium">Financials</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-line text-left text-xs text-ink-soft">
                        <th className="py-1.5 font-medium">Year</th>
                        <th className="py-1.5 font-medium">Revenue (₹ Cr)</th>
                        <th className="py-1.5 font-medium">Profit (₹ Cr)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ipo.financials.map((f) => (
                        <tr key={f.year} className="border-b border-line last:border-0">
                          <td className="py-1.5">{f.year}</td>
                          <td className="py-1.5 font-mono-data">{f.revenueCr.toLocaleString("en-IN")}</td>
                          <td className={`py-1.5 font-mono-data ${f.profitCr < 0 ? "text-down" : ""}`}>
                            {f.profitCr.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="rounded-md bg-gold-soft px-3 py-2 text-xs text-ink-soft">
                This information is for general awareness only and does not constitute investment advice. Read the
                official prospectus before applying.
              </p>
            </CardContent>
          </Card>

          {articles.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-lg font-semibold">Related articles</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {articles.map((a) => (
                  <ArticleCard key={a.id} article={a} compact />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Important dates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2.5 text-sm">
                {importantDates.map((d) => (
                  <li key={d.label} className="flex items-center justify-between">
                    <span className="text-ink-soft">{d.label}</span>
                    <span className="font-medium">{formatDate(d.date)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Registrar & lead managers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-ink-soft">Registrar</p>
                <a href={ipo.registrarUrl} target="_blank" rel="noopener noreferrer nofollow" className="font-medium text-brand hover:underline">
                  {ipo.registrar}
                </a>
              </div>
              <div>
                <p className="text-ink-soft">Lead managers</p>
                <ul className="mt-1 space-y-1">
                  {ipo.leadManagers.map((lm) => (
                    <li key={lm} className="font-medium">
                      {lm}
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="/allotment" className="inline-block text-sm font-medium text-brand hover:underline">
                Check allotment status
              </Link>
            </CardContent>
          </Card>

          <AdBanner slot="sidebar" />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 font-display text-xl font-semibold">Related IPOs</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <IPOCard key={r.id} ipo={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink-soft/70">{label}</p>
      <p className="font-mono-data text-sm font-semibold">{value}</p>
    </div>
  );
}
