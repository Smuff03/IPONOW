"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminListIpos = adminListIpos;
exports.adminCreateOrUpdateIpo = adminCreateOrUpdateIpo;
exports.adminDeleteIpo = adminDeleteIpo;
exports.adminEditGmp = adminEditGmp;
exports.adminEditSubscription = adminEditSubscription;
exports.adminListArticles = adminListArticles;
exports.adminCreateOrUpdateArticle = adminCreateOrUpdateArticle;
exports.adminDeleteArticle = adminDeleteArticle;
exports.adminListDataSources = adminListDataSources;
exports.adminToggleDataSource = adminToggleDataSource;
exports.adminListAllotmentSources = adminListAllotmentSources;
exports.adminCreateAllotmentSource = adminCreateAllotmentSource;
exports.adminDeleteAllotmentSource = adminDeleteAllotmentSource;
exports.adminListUpdateLogs = adminListUpdateLogs;
exports.adminSyncNow = adminSyncNow;
exports.adminTriggerJob = adminTriggerJob;
const zod_1 = require("zod");
const prisma_1 = require("../utils/prisma.js");
const errorHandler_1 = require("../middleware/errorHandler.js");
const logger_1 = require("../utils/logger.js");
const gmpService_1 = require("../services/gmpService.js");
const ipoService_1 = require("../services/ipoService.js");
const subscriptionService_1 = require("../services/subscriptionService.js");
const articleService_1 = require("../services/articleService.js");
const reviewService_1 = require("../services/reviewService.js");
// ---------- IPOs ----------
const ipoInputSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    company: zod_1.z.string().min(1),
    type: zod_1.z.enum(["MAINBOARD", "SME"]).default("MAINBOARD"),
    priceBandMin: zod_1.z.number().int().positive(),
    priceBandMax: zod_1.z.number().int().positive(),
    lotSize: zod_1.z.number().int().positive(),
    issueSizeCr: zod_1.z.number().positive(),
    openDate: zod_1.z.string(),
    closeDate: zod_1.z.string(),
    allotmentDate: zod_1.z.string().optional(),
    listingDate: zod_1.z.string().optional(),
    registrar: zod_1.z.string().optional(),
    registrarUrl: zod_1.z.string().url().optional(),
    leadManagers: zod_1.z.array(zod_1.z.string()).optional(),
    about: zod_1.z.string().optional(),
    strengths: zod_1.z.array(zod_1.z.string()).optional(),
    risks: zod_1.z.array(zod_1.z.string()).optional(),
});
async function adminListIpos(_req, res) {
    const ipos = await prisma_1.prisma.iPO.findMany({ orderBy: { createdAt: "desc" } });
    res.json(ipos);
}
async function adminCreateOrUpdateIpo(req, res) {
    const parsed = ipoInputSchema.safeParse(req.body);
    if (!parsed.success)
        throw new errorHandler_1.ApiError(400, parsed.error.issues.map((i) => i.message).join(", "));
    const ipo = await (0, ipoService_1.upsertIpoRecord)({ ...parsed.data, source: "Admin manual entry", sourceUrl: "internal://admin" });
    res.json(ipo);
}
async function adminDeleteIpo(req, res) {
    await prisma_1.prisma.iPO.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
}
const gmpEditSchema = zod_1.z.object({ gmp: zod_1.z.number().int() });
async function adminEditGmp(req, res) {
    const parsed = gmpEditSchema.safeParse(req.body);
    if (!parsed.success)
        throw new errorHandler_1.ApiError(400, "gmp must be an integer");
    const ipo = await prisma_1.prisma.iPO.update({
        where: { id: String(req.params.id) },
        data: { gmp: parsed.data.gmp, source: "Admin manual entry", lastUpdated: new Date(), isStale: false },
    });
    res.json(ipo);
}
const subscriptionEditSchema = zod_1.z.object({
    day: zod_1.z.number().int().positive(),
    qib: zod_1.z.number(),
    nii: zod_1.z.number(),
    retail: zod_1.z.number(),
    employee: zod_1.z.number().optional(),
    total: zod_1.z.number(),
});
async function adminEditSubscription(req, res) {
    const parsed = subscriptionEditSchema.safeParse(req.body);
    if (!parsed.success)
        throw new errorHandler_1.ApiError(400, "Invalid subscription payload");
    const { day, ...rest } = parsed.data;
    const ipoId = String(req.params.id);
    const subscription = await prisma_1.prisma.subscription.upsert({
        where: { id: `${ipoId}-day-${day}` },
        create: { id: `${ipoId}-day-${day}`, ipoId, day, source: "Admin manual entry", ...rest },
        update: { ...rest, source: "Admin manual entry", timestamp: new Date() },
    });
    res.json(subscription);
}
// ---------- Articles ----------
const articleInputSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    excerpt: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    image: zod_1.z.string().url().optional(),
    category: zod_1.z.enum(["NEWS", "ANALYSIS", "GMP_UPDATE", "GUIDE", "ALLOTMENT_GUIDE"]),
    status: zod_1.z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});
async function adminListArticles(_req, res) {
    const articles = await prisma_1.prisma.article.findMany({ orderBy: { updatedAt: "desc" } });
    res.json(articles);
}
async function adminCreateOrUpdateArticle(req, res) {
    const parsed = articleInputSchema.safeParse(req.body);
    if (!parsed.success)
        throw new errorHandler_1.ApiError(400, parsed.error.issues.map((i) => i.message).join(", "));
    const data = parsed.data;
    const article = await prisma_1.prisma.article.upsert({
        where: { slug: data.slug },
        create: { ...data, source: "Admin", sourceUrl: "internal://admin" },
        update: data,
    });
    res.json(article);
}
async function adminDeleteArticle(req, res) {
    await prisma_1.prisma.article.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
}
// ---------- Data sources ----------
async function adminListDataSources(_req, res) {
    const sources = await prisma_1.prisma.dataSource.findMany({ orderBy: { name: "asc" } });
    res.json(sources);
}
const dataSourceToggleSchema = zod_1.z.object({ enabled: zod_1.z.boolean() });
async function adminToggleDataSource(req, res) {
    const parsed = dataSourceToggleSchema.safeParse(req.body);
    if (!parsed.success)
        throw new errorHandler_1.ApiError(400, "enabled must be a boolean");
    const source = await prisma_1.prisma.dataSource.update({ where: { id: String(req.params.id) }, data: { enabled: parsed.data.enabled } });
    res.json(source);
}
// ---------- Allotment sources ----------
const allotmentSourceSchema = zod_1.z.object({
    registrar: zod_1.z.string().min(1),
    url: zod_1.z.string().url(),
    ipoSlug: zod_1.z.string().optional(),
    note: zod_1.z.string().optional(),
    enabled: zod_1.z.boolean().default(true),
});
async function adminListAllotmentSources(_req, res) {
    res.json(await prisma_1.prisma.allotmentSource.findMany({ orderBy: { registrar: "asc" } }));
}
async function adminCreateAllotmentSource(req, res) {
    const parsed = allotmentSourceSchema.safeParse(req.body);
    if (!parsed.success)
        throw new errorHandler_1.ApiError(400, parsed.error.issues.map((i) => i.message).join(", "));
    res.json(await prisma_1.prisma.allotmentSource.create({ data: parsed.data }));
}
async function adminDeleteAllotmentSource(req, res) {
    await prisma_1.prisma.allotmentSource.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
}
// ---------- Update logs & manual trigger ----------
async function adminListUpdateLogs(_req, res) {
    const logs = await prisma_1.prisma.updateLog.findMany({ orderBy: { startedAt: "desc" }, take: 100 });
    res.json(logs);
}
const JOB_RUNNERS = {
    gmp: gmpService_1.ingestGmp,
    ipos: ipoService_1.ingestUpcomingIpos,
    subscriptions: subscriptionService_1.ingestSubscriptions,
    articles: articleService_1.ingestArticles,
    reviews: reviewService_1.ingestReviews,
    statuses: async () => ({ touched: await (0, ipoService_1.refreshIpoStatuses)() }),
};
/**
 * POST /api/admin/sync-now — manually triggers the RapidAPI → Database sync
 * (IPO listings, then GMP) outside the 30-min cron cadence. Wraps the same
 * ingestUpcomingIpos/ingestGmp services the scheduler uses, so behavior
 * (retry, error handling, "keep previous data on failure") is identical.
 */
async function adminSyncNow(_req, res) {
    const results = {};
    for (const [job, runner] of Object.entries({ ipos: ipoService_1.ingestUpcomingIpos, gmp: gmpService_1.ingestGmp })) {
        const log = await prisma_1.prisma.updateLog.create({ data: { job, status: "SUCCESS", startedAt: new Date() } });
        try {
            const result = await runner();
            results[job] = result;
            await prisma_1.prisma.updateLog.update({
                where: { id: log.id },
                data: {
                    status: result.errors?.length ? "PARTIAL" : "SUCCESS",
                    recordsTouched: result.touched,
                    message: result.errors?.join("; ") || null,
                    finishedAt: new Date(),
                },
            });
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logger_1.logger.error(`Manual sync-now step "${job}" failed`, { error: message });
            results[job] = { touched: 0, errors: [message] };
            await prisma_1.prisma.updateLog.update({
                where: { id: log.id },
                data: { status: "FAILURE", message, finishedAt: new Date() },
            });
        }
    }
    res.json({ syncedAt: new Date().toISOString(), results });
}
async function adminTriggerJob(req, res) {
    const job = String(req.params.job);
    const runner = JOB_RUNNERS[job];
    if (!runner)
        throw new errorHandler_1.ApiError(400, `Unknown job "${job}". Valid jobs: ${Object.keys(JOB_RUNNERS).join(", ")}`);
    const log = await prisma_1.prisma.updateLog.create({ data: { job, status: "SUCCESS", startedAt: new Date() } });
    try {
        const result = await runner();
        await prisma_1.prisma.updateLog.update({
            where: { id: log.id },
            data: {
                status: result.errors?.length ? "PARTIAL" : "SUCCESS",
                recordsTouched: result.touched,
                message: result.errors?.join("; "),
                finishedAt: new Date(),
            },
        });
        res.json({ job, ...result });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger_1.logger.error(`Manual trigger for job "${job}" failed`, { error: message });
        await prisma_1.prisma.updateLog.update({
            where: { id: log.id },
            data: { status: "FAILURE", message, finishedAt: new Date() },
        });
        throw new errorHandler_1.ApiError(500, `Job "${job}" failed: ${message}`);
    }
}
