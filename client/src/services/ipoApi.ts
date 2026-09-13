// Thin client-side data layer. Every function returns data shaped exactly like
// the real /api/* responses (see server/src/routes) so that swapping the mock
// implementations below for real `fetch` calls against the Express API is a
// drop-in change with no changes needed in components.
import { IPOS } from "@/data/mockIpos";
import { ARTICLES } from "@/data/mockArticles";
import { REVIEWS, ALLOTMENT_LINKS } from "@/data/mockReviews";
import { mapIpo, mapArticle, mapReview } from "@/services/apiMappers";
import type { IPO, IPOStatus, Article, Review, AllotmentLink } from "@/types/ipo";

const USE_LIVE_API = true; // reading from the Express API (server/src) — database is the source of truth
const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

function delay<T>(value: T, ms = 180): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function getIpos(params?: { status?: IPOStatus | "all"; search?: string }): Promise<IPO[]> {
  if (USE_LIVE_API) {
    const qs = new URLSearchParams();
    if (params?.status && params.status !== "all") qs.set("status", params.status);
    if (params?.search) qs.set("search", params.search);
    const res = await fetch(`${API_BASE}/ipos?${qs.toString()}`);
    if (!res.ok) {
      throw new Error(`GET /ipos failed: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    // Backend returns { items, total, page, pageSize } — normalize to a plain array,
    // then map Prisma-shaped records (uppercase enums, Decimal strings) to the UI shape.
    const items = Array.isArray(json) ? json : json.items ?? [];
    return items.map(mapIpo);
  }
  let data = [...IPOS];
  if (params?.status && params.status !== "all") data = data.filter((i) => i.status === params.status);
  if (params?.search) {
    const q = params.search.toLowerCase();
    data = data.filter((i) => i.name.toLowerCase().includes(q) || i.company.toLowerCase().includes(q));
  }
  return delay(data);
}

export async function getIpoBySlug(slug: string): Promise<IPO | undefined> {
  if (USE_LIVE_API) {
    const res = await fetch(`${API_BASE}/ipos/${slug}`);
    if (!res.ok) return undefined;
    return mapIpo(await res.json());
  }
  return delay(IPOS.find((i) => i.slug === slug));
}

export async function getUpcomingIpos(limit = 6): Promise<IPO[]> {
  const data = await getIpos({ status: "upcoming" });
  return data.slice(0, limit);
}

export async function getOpenIpos(): Promise<IPO[]> {
  const data = await getIpos();
  return data.filter((i) => i.status === "open" || i.status === "closing_today");
}

export async function getRecentlyClosed(limit = 6): Promise<IPO[]> {
  const data = await getIpos({ status: "listed" });
  return data.slice(0, limit);
}

export async function getGmpLeaders(limit = 8): Promise<IPO[]> {
  const data = await getIpos();
  return [...data].sort((a, b) => b.gmp / b.priceBandMax - a.gmp / a.priceBandMax).slice(0, limit);
}

export async function getArticles(params?: { category?: string; search?: string }): Promise<Article[]> {
  if (USE_LIVE_API) {
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.search) qs.set("search", params.search);
    const res = await fetch(`${API_BASE}/articles?${qs.toString()}`);
    if (!res.ok) {
      throw new Error(`GET /articles failed: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    const items = Array.isArray(json) ? json : json.items ?? [];
    return items.map(mapArticle);
  }
  let data = [...ARTICLES].filter((a) => a.status === "published");
  if (params?.category) data = data.filter((a) => a.category === params.category);
  if (params?.search) {
    const q = params.search.toLowerCase();
    data = data.filter((a) => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
  }
  return delay(data.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt)));
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  if (USE_LIVE_API) {
    const res = await fetch(`${API_BASE}/articles/${slug}`);
    if (!res.ok) return undefined;
    return mapArticle(await res.json());
  }
  return delay(ARTICLES.find((a) => a.slug === slug));
}

export async function getReviews(): Promise<Review[]> {
  if (USE_LIVE_API) {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error(`GET /reviews failed: ${res.status} ${res.statusText}`);
    const json = await res.json();
    const items = Array.isArray(json) ? json : json.items ?? [];
    return items.map(mapReview);
  }
  return delay(REVIEWS);
}

export async function getAllotmentLinks(): Promise<AllotmentLink[]> {
  if (USE_LIVE_API) {
    const res = await fetch(`${API_BASE}/allotment`);
    if (!res.ok) throw new Error(`GET /allotment failed: ${res.status} ${res.statusText}`);
    const json = await res.json();
    return Array.isArray(json) ? json : json.items ?? [];
  }
  return delay(ALLOTMENT_LINKS);
}
