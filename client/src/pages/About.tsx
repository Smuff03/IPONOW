import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Database, Clock3 } from "lucide-react";

const PRINCIPLES = [
  {
    icon: Database,
    title: "Sourced, never simulated",
    body: "Every GMP, subscription and status figure carries a source, a link back to it, and a last-updated timestamp. If a source goes stale, we say so instead of guessing.",
  },
  {
    icon: Clock3,
    title: "Refreshed on a schedule",
    body: "GMP and status update every 30 minutes while an issue is live; upcoming listings and articles refresh hourly. Nothing here is generated on the fly.",
  },
  {
    icon: ShieldCheck,
    title: "Independent, not investment advice",
    body: "We aren't affiliated with any exchange, registrar or issuer. GMP and listing estimates are unofficial market indicators, not recommendations.",
  },
];

export function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Seo
        title="About Greenshoe"
        description="Greenshoe is an independent IPO tracking portal covering grey market premium, subscription data, allotment status and market news."
        canonicalPath="/about"
      />
      <Breadcrumbs items={[{ label: "About us" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold">About Greenshoe</h1>
      <p className="mt-4 text-ink-soft">
        Greenshoe tracks India's primary market — mainboard and SME IPOs — so investors can see grey market premium,
        subscription numbers, price bands and allotment status in one place, without digging through a dozen
        registrar sites and forums.
      </p>
      <p className="mt-3 text-ink-soft">
        The name comes from the "greenshoe" option: the over-allotment mechanism underwriters use to stabilise a
        stock's price just after listing. It felt like the right name for a site built around watching that exact
        moment closely.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <Card key={p.title}>
            <CardContent className="pt-4">
              <p.icon className="h-5 w-5 text-brand" />
              <p className="mt-3 font-display font-semibold">{p.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{p.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
