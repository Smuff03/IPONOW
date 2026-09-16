"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listIpos = listIpos;
exports.getIpoBySlug = getIpoBySlug;
exports.getGmpSnapshot = getGmpSnapshot;
exports.getSubscriptions = getSubscriptions;
const prisma_1 = require("../utils/prisma.js");
const errorHandler_1 = require("../middleware/errorHandler.js");
const PUBLIC_IPO_SELECT = {
    id: true,
    name: true,
    slug: true,
    company: true,
    logo: true,
    type: true,
    priceBandMin: true,
    priceBandMax: true,
    lotSize: true,
    issueSizeCr: true,
    gmp: true,
    gmpTrend: true,
    expectedSubscription: true,
    estimatedListing: true,
    openDate: true,
    closeDate: true,
    allotmentDate: true,
    refundDate: true,
    demateDate: true,
    listingDate: true,
    status: true,
    registrar: true,
    registrarUrl: true,
    leadManagers: true,
    about: true,
    strengths: true,
    risks: true,
    source: true,
    sourceUrl: true,
    lastUpdated: true,
    isStale: true,
};
async function listIpos(req, res) {
    const { status, search, page = "1", pageSize = "20" } = req.query;
    const where = {};
    if (status && status !== "all")
        where.status = String(status).toUpperCase();
    if (search) {
        where.OR = [
            { name: { contains: search, mode: "insensitive" } },
            { company: { contains: search, mode: "insensitive" } },
        ];
    }
    const take = Math.min(50, Number(pageSize) || 20);
    const skip = (Math.max(1, Number(page) || 1) - 1) * take;
    const [items, total] = await Promise.all([
        prisma_1.prisma.iPO.findMany({ where, select: PUBLIC_IPO_SELECT, orderBy: { openDate: "desc" }, take, skip }),
        prisma_1.prisma.iPO.count({ where }),
    ]);
    res.json({ items, total, page: Number(page) || 1, pageSize: take });
}
async function getIpoBySlug(req, res) {
    const ipo = await prisma_1.prisma.iPO.findUnique({
        where: { slug: String(req.params.slug) },
        select: {
            ...PUBLIC_IPO_SELECT,
            gmpHistory: { orderBy: { timestamp: "asc" }, select: { gmp: true, timestamp: true } },
            subscriptions: { orderBy: { day: "asc" } },
        },
    });
    if (!ipo)
        throw new errorHandler_1.ApiError(404, "IPO not found");
    res.json(ipo);
}
async function getGmpSnapshot(_req, res) {
    const ipos = await prisma_1.prisma.iPO.findMany({
        where: { status: { in: ["OPEN", "CLOSING_TODAY", "UPCOMING"] } },
        select: { slug: true, name: true, gmp: true, gmpTrend: true, lastUpdated: true, isStale: true, source: true },
        orderBy: { gmp: "desc" },
    });
    res.json(ipos);
}
async function getSubscriptions(req, res) {
    const { slug } = req.query;
    const where = slug ? { ipo: { slug } } : {};
    const subscriptions = await prisma_1.prisma.subscription.findMany({
        where,
        include: { ipo: { select: { slug: true, name: true } } },
        orderBy: [{ ipoId: "asc" }, { day: "asc" }],
    });
    res.json(subscriptions);
}
