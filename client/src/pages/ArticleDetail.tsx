import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArticleCard } from "@/components/ArticleCard";
import { IPOCard } from "@/components/IPOCard";
import { AdBanner } from "@/components/AdBanner";
import { ErrorState } from "@/components/ErrorState";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getArticleBySlug, getArticles, getIpos } from "@/services/ipoApi";
import { formatDate } from "@/lib/utils";
import type { Article, IPO } from "@/types/ipo";

export function ArticleDetail() {
  const { slug = "" } = useParams();
  const [article, setArticle] = useState<Article | null | undefined>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [relatedIpos, setRelatedIpos] = useState<IPO[]>([]);

  useEffect(() => {
    let active = true;
    setArticle(null);
    getArticleBySlug(slug).then((a) => active && setArticle(a ?? undefined));
    getArticles().then((all) => active && setRelated(all.filter((a) => a.slug !== slug).slice(0, 3)));
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (article && article.relatedIpoSlugs?.length) {
      getIpos().then((all) => setRelatedIpos(all.filter((i) => article.relatedIpoSlugs?.includes(i.slug))));
    }
  }, [article]);

  if (article === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState title="Article not found" message="This article may have been removed or the link is incorrect." />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Seo
        title={article.title}
        description={article.excerpt}
        canonicalPath={`/articles/${article.slug}`}
        image={article.image}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          headline: article.title,
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          image: article.image,
        }}
      />
      <Breadcrumbs items={[{ label: "Articles", href: "/articles" }, { label: article.title }]} />

      <Badge className="mt-4">{article.category.replace("-", " ")}</Badge>
      <h1 className="mt-2 font-display text-3xl font-semibold leading-tight">{article.title}</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Published {formatDate(article.publishedAt)}
        {article.updatedAt !== article.publishedAt && ` · Updated ${formatDate(article.updatedAt)}`} · Source:{" "}
        {article.source}
      </p>

      <img src={article.image} alt="" className="mt-6 aspect-[16/9] w-full rounded-[var(--radius-card)] object-cover" />

      <div className="prose-content mt-6 space-y-4 text-[15px] leading-relaxed text-ink">
        <p>{article.content}</p>
      </div>

      <div className="mt-8">
        <AdBanner slot="in-article" />
      </div>

      {relatedIpos.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold">Related IPOs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedIpos.map((ipo) => (
              <IPOCard key={ipo.id} ipo={ipo} />
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 font-display text-lg font-semibold">Related articles</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
