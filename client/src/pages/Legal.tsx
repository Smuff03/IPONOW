import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";

function LegalPage({ title, canonicalPath, children }: { title: string; canonicalPath: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Seo title={title} description={`${title} for Greenshoe.`} canonicalPath={canonicalPath} />
      <Breadcrumbs items={[{ label: title }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold">{title}</h1>
      <div className="prose-content mt-4 space-y-4 text-sm leading-relaxed text-ink-soft">{children}</div>
    </div>
  );
}

export function Disclaimer() {
  return (
    <LegalPage title="Disclaimer" canonicalPath="/disclaimer">
      <p>
        Greenshoe is an independent information portal and is not affiliated with any stock exchange, registrar,
        merchant banker, or issuer company.
      </p>
      <p>
        GMP (grey market premium), expected listing price, and subscription estimates displayed on this site are
        unofficial market indicators sourced from third parties and should not be considered investment advice, a
        recommendation, or a guarantee of any listing outcome.
      </p>
      <p>
        Investors should read the official prospectus (RHP/DRHP) filed with SEBI and consult a registered financial
        advisor before making any investment decision.
      </p>
    </LegalPage>
  );
}

export function Privacy() {
  return (
    <LegalPage title="Privacy policy" canonicalPath="/privacy">
      <p>
        We collect minimal personal information — only what you voluntarily submit through our contact form (name,
        email, and message). We do not sell personal data to third parties.
      </p>
      <p>
        This site may display advertising served by third-party ad networks (e.g. Google AdSense), which may use
        cookies to serve relevant ads. You can control ad personalisation through your browser and Google Ads
        Settings.
      </p>
      <p>Update this policy with your organisation's actual data practices before going to production.</p>
    </LegalPage>
  );
}

export function Terms() {
  return (
    <LegalPage title="Terms of use" canonicalPath="/terms">
      <p>
        By using this site, you agree that all IPO data, GMP figures, and market commentary are provided "as is" for
        informational purposes only, without warranty of accuracy or completeness.
      </p>
      <p>
        Content aggregated from third-party sources remains the property of its respective owners; we link back to
        original sources rather than reproducing them in full.
      </p>
    </LegalPage>
  );
}
