import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-paper-raised">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="rounded-lg border border-gold/30 bg-gold-soft px-4 py-3 text-xs leading-relaxed text-ink-soft">
          GMP, expected listing price and subscription estimates are unofficial market indicators and should not be
          considered investment advice.
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white">
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
              <span className="font-display font-semibold">Greenshoe</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-ink-soft">
              Independent IPO tracking: grey market premium, subscription data, allotment status and market news in
              one place.
            </p>
          </div>

          <FooterCol
            title="Explore"
            links={[
              { to: "/ipos", label: "IPO dashboard" },
              { to: "/allotment", label: "Check allotment" },
              { to: "/reviews", label: "Reviews & sentiment" },
              { to: "/articles", label: "Articles" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { to: "/about", label: "About us" },
              { to: "/contact", label: "Contact us" },
              { to: "/articles/understanding-grey-market-premium-guide", label: "What is GMP?" },
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              { to: "/disclaimer", label: "Disclaimer" },
              { to: "/privacy", label: "Privacy policy" },
              { to: "/terms", label: "Terms of use" },
            ]}
          />
        </div>

        <p className="mt-10 border-t border-line pt-6 text-xs text-ink-soft">
          © {new Date().getFullYear()} Greenshoe. Not affiliated with any stock exchange, registrar or issuer. All
          data is aggregated from publicly available sources and marked with source and update time.
        </p>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <p className="font-display text-sm font-semibold">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="text-sm text-ink-soft hover:text-brand">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
