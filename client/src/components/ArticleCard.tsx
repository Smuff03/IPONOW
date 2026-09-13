import { Link } from "react-router-dom";
import type { Article } from "@/types/ipo";
import { formatDate } from "@/lib/utils";
import { Badge } from "./ui/badge";

const CATEGORY_LABEL: Record<Article["category"], string> = {
  news: "News",
  analysis: "Analysis",
  "gmp-update": "GMP update",
  guide: "Guide",
  "allotment-guide": "Allotment guide",
};

export function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  return (
    <Link
      to={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper-raised transition-shadow hover:shadow-md"
    >
      <div className={compact ? "hidden" : "aspect-[16/9] w-full overflow-hidden bg-ink/5"}>
        <img
          src={article.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge className="w-fit">{CATEGORY_LABEL[article.category]}</Badge>
        <h3 className="font-display font-semibold leading-snug group-hover:text-brand">{article.title}</h3>
        {!compact && <p className="line-clamp-2 text-sm text-ink-soft">{article.excerpt}</p>}
        <p className="mt-auto pt-1 text-xs text-ink-soft">{formatDate(article.publishedAt)}</p>
      </div>
    </Link>
  );
}
