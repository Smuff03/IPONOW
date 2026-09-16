"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listArticles = listArticles;
exports.getArticleBySlug = getArticleBySlug;
exports.listReviews = listReviews;
exports.listAllotmentSources = listAllotmentSources;
const prisma_1 = require("../utils/prisma.js");
const errorHandler_1 = require("../middleware/errorHandler.js");
async function listArticles(req, res) {
    const { category, search, page = "1", pageSize = "20" } = req.query;
    const where = { status: "PUBLISHED" };
    if (category)
        where.category = String(category).toUpperCase();
    if (search) {
        where.OR = [
            { title: { contains: search, mode: "insensitive" } },
            { excerpt: { contains: search, mode: "insensitive" } },
        ];
    }
    const take = Math.min(50, Number(pageSize) || 20);
    const skip = (Math.max(1, Number(page) || 1) - 1) * take;
    const [items, total] = await Promise.all([
        prisma_1.prisma.article.findMany({ where, orderBy: { publishedAt: "desc" }, take, skip }),
        prisma_1.prisma.article.count({ where }),
    ]);
    res.json({ items, total, page: Number(page) || 1, pageSize: take });
}
async function getArticleBySlug(req, res) {
    const article = await prisma_1.prisma.article.findFirst({
        where: { slug: String(req.params.slug), status: "PUBLISHED" },
        include: { relatedIpos: { select: { slug: true, name: true } } },
    });
    if (!article)
        throw new errorHandler_1.ApiError(404, "Article not found");
    res.json(article);
}
async function listReviews(_req, res) {
    const reviews = await prisma_1.prisma.review.findMany({
        include: { ipo: { select: { slug: true, name: true } } },
        orderBy: { publishedAt: "desc" },
    });
    res.json(reviews);
}
async function listAllotmentSources(_req, res) {
    const sources = await prisma_1.prisma.allotmentSource.findMany({ where: { enabled: true }, orderBy: { registrar: "asc" } });
    res.json(sources);
}
