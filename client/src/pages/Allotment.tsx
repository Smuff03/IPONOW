import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdBanner } from "@/components/AdBanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllotmentLinks } from "@/services/ipoApi";
import type { AllotmentLink } from "@/types/ipo";
import { ExternalLink, FileSearch, Landmark, ListChecks } from "lucide-react";

const STEPS = [
  {
    title: "Find your registrar",
    body: "Each IPO appoints a registrar (e.g. Kfin Technologies, Link Intime, Bigshare) to manage the allotment process. You can find this on the IPO's detail page here.",
  },
  {
    title: "Open the registrar's allotment page",
    body: "Use the registrar link below, select the relevant IPO from their dropdown, and enter your PAN, application number, or demat account (DP ID + Client ID).",
  },
  {
    title: "Or check via BSE / NSE",
    body: "Both exchanges offer a general allotment-status lookup using your application number and PAN, independent of the registrar's own portal.",
  },
  {
    title: "Review your result",
    body: "Full allotment, partial allotment, or no allotment will be shown. If allotted, shares are credited to your demat account ahead of the listing date and refunds (if any) are initiated shortly after.",
  },
];

const FAQS = [
  {
    q: "When does allotment happen after an IPO closes?",
    a: "Allotment is typically finalised within 1-2 working days of the issue closing, following the exchange-approved basis of allotment.",
  },
  {
    q: "What if I applied but wasn't allotted any shares?",
    a: "If your application wasn't allotted, the blocked amount in your bank account (under ASBA) is released automatically — no separate refund step is usually needed.",
  },
  {
    q: "Can I check allotment status without a PAN?",
    a: "Most registrars also allow lookup via application number or demat account details (DP ID + Client ID) if you don't want to enter your PAN.",
  },
];

export function Allotment() {
  const [links, setLinks] = useState<AllotmentLink[] | null>(null);

  useEffect(() => {
    getAllotmentLinks().then(setLinks);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Seo
        title="Check IPO allotment status — registrar, BSE & NSE links"
        description="Check your IPO allotment status via registrar links (Kfin, Link Intime, Bigshare), BSE and NSE. Step-by-step guide to how IPO allotment works."
        canonicalPath="/allotment"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <Breadcrumbs items={[{ label: "Allotment" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold">Check IPO allotment status</h1>
      <p className="mt-1 max-w-2xl text-ink-soft">
        Look up your allotment directly with the registrar, or via BSE / NSE. Links are kept up to date and never
        hardcoded to a single issue.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Registrar links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {links
                ? links
                    .filter((l) => l.registrar !== "BSE" && l.registrar !== "NSE")
                    .map((link) => <LinkRow key={link.id} link={link} icon={<Landmark className="h-4 w-4" />} />)
                : Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-md bg-ink/5" />)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange lookup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {links
                ?.filter((l) => l.registrar === "BSE" || l.registrar === "NSE")
                .map((link) => <LinkRow key={link.id} link={link} icon={<FileSearch className="h-4 w-4" />} />)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How IPO allotment works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{step.title}</p>
                      <p className="text-sm text-ink-soft">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-line p-0">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group p-4 first:pt-0">
                  <summary className="cursor-pointer list-none font-medium marker:content-none">
                    <span className="flex items-center justify-between">
                      {faq.q}
                      <span className="text-ink-soft transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm text-ink-soft">{faq.a}</p>
                </details>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-brand-soft/60">
            <CardContent className="pt-4">
              <ListChecks className="h-5 w-5 text-brand" />
              <p className="mt-2 font-display font-semibold">Don't know your registrar?</p>
              <p className="mt-1 text-sm text-ink-soft">
                Visit the IPO's detail page from the dashboard — the registrar and a direct link are listed in the
                sidebar under "Registrar & lead managers".
              </p>
            </CardContent>
          </Card>
          <AdBanner slot="sidebar" />
        </div>
      </div>
    </div>
  );
}

function LinkRow({ link, icon }: { link: AllotmentLink; icon: React.ReactNode }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="flex items-center justify-between rounded-md border border-line px-3 py-2.5 text-sm hover:bg-ink/5"
    >
      <span className="flex items-center gap-2 font-medium">
        {icon}
        {link.registrar}
      </span>
      <ExternalLink className="h-3.5 w-3.5 text-ink-soft" />
    </a>
  );
}
