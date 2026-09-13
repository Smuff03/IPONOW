import { useState } from "react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail } from "lucide-react";

export function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Seo
        title="Contact us"
        description="Get in touch with the Greenshoe team for corrections, data source suggestions, or partnership inquiries."
        canonicalPath="/contact"
      />
      <Breadcrumbs items={[{ label: "Contact us" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold">Contact us</h1>
      <p className="mt-1 text-ink-soft">
        Spotted an error, or want to suggest a data source? We'd like to hear from you.
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-[var(--radius-card)] border border-line bg-paper-raised p-4 text-sm">
        <Mail className="h-4 w-4 text-brand" />
        <a href="mailto:hello@greenshoe.example.com" className="font-medium text-brand hover:underline">
          hello@greenshoe.example.com
        </a>
      </div>

      {submitted ? (
        <div className="mt-6 flex items-center gap-2 rounded-[var(--radius-card)] border border-brand/30 bg-brand-soft px-4 py-3 text-sm text-brand">
          <CheckCircle2 className="h-4 w-4" /> Thanks — your message has been noted. We'll get back to you soon.
        </div>
      ) : (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Your name" required />
            <Input type="email" placeholder="Email address" required />
          </div>
          <Input placeholder="Subject" required />
          <textarea
            required
            rows={5}
            placeholder="Your message"
            className="w-full rounded-lg border border-line bg-paper-raised p-3 text-sm placeholder:text-ink-soft/70 focus-visible:border-brand"
          />
          <Button type="submit">Send message</Button>
        </form>
      )}
    </div>
  );
}
