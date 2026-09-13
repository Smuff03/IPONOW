import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_NAME = "Greenshoe";
const SITE_URL = "https://greenshoe.example.com"; // replace with production domain

/**
 * Lightweight SEO manager for a client-rendered SPA: sets document title, meta
 * description, canonical link, Open Graph / Twitter tags and JSON-LD structured
 * data on every route change. For full SSR/pre-rendered meta tags (recommended
 * for production SEO), pair this with a prerendering step (e.g. vite-plugin-ssr,
 * or serving pre-rendered HTML per route from the Express server) — see README.
 */
export function Seo({ title, description, canonicalPath, image, jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    document.title = fullTitle;
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;

    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:type", "website");
    if (image) upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);

    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;

    let script = document.querySelector<HTMLScriptElement>('script[data-seo="jsonld"]');
    if (jsonLd) {
      if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.seo = "jsonld";
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    } else if (script) {
      script.remove();
    }
  }, [title, description, canonicalPath, image, jsonLd]);

  return null;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}
