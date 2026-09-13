import { useEffect, useState } from "react";
import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { SearchBar } from "@/components/SearchBar";
import { AdBanner } from "@/components/AdBanner";
import { IPOListSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/ErrorState";
import { useDebounce } from "@/hooks/useDebounce";
import { getArticles } from "@/services/ipoApi";
import type { Article } from "@/types/ipo";
import { cn } from "@/lib/utils";

const CATEGORIES: { key: Article["category"] | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "news", label: "News" },
  { key: "analysis", label: "Analysis" },
  { key: "gmp-update", label: "GMP updates" },
  { key: "guide", label: "Guides" },
  { key: "allotment-guide", label: "Allotment guides" },
];

export function Articles() {
  const [category, setCategory] = useState<Article["category"] | "all">("all");
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState<Article[] | null>(null);
  const debouncedSearch = useDebounce(search, 250);

  useEffect(() => {
    setArticles(null);
    getArticles({ category: category === "all" ? undefined : category, search: debouncedSearch }).then(setArticles);
  }, [category, debouncedSearch]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Seo
        title="IPO articles, news & guides"
        description="Latest IPO news, GMP updates, subscription analysis and step-by-step guides on allotment and applying for IPOs."
        canonicalPath="/articles"
      />
      <Breadcrumbs items={[{ label: "Articles" }]} />
      <h1 className="mt-3 font-display text-3xl font-semibold">Articles & guides</h1>
      <p className="mt-1 text-ink-soft">News, analysis and how-to guides for IPO investors.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg bg-ink/5 p-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                category === c.key ? "bg-paper-raised text-ink shadow-sm" : "text-ink-soft hover:text-ink"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
        <SearchBar value={search} onChange={setSearch} placeholder="Search articles" />
      </div>

      <div className="mt-8">
        {articles ? (
          articles.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          ) : (
            <EmptyState title="No articles found" message="Try a different category or search term." />
          )
        ) : (
          <IPOListSkeleton count={6} />
        )}
      </div>

      <div className="mt-8">
        <AdBanner slot="in-feed" />
      </div>
    </div>
  );
}
