"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startScheduledJobs = startScheduledJobs;
const node_cron_1 = __importDefault(require("node-cron"));
const env_1 = require("../config/env.js");
const logger_1 = require("../utils/logger.js");
const prisma_1 = require("../utils/prisma.js");
const gmpService_1 = require("../services/gmpService.js");
const ipoService_1 = require("../services/ipoService.js");
const subscriptionService_1 = require("../services/subscriptionService.js");
const articleService_1 = require("../services/articleService.js");
const reviewService_1 = require("../services/reviewService.js");
async function runJob(name, fn) {
    const log = await prisma_1.prisma.updateLog.create({ data: { job: name, status: "SUCCESS", startedAt: new Date() } });
    try {
        const result = await fn();
        const touched = typeof result === "number" ? result : result.touched;
        const errors = typeof result === "number" ? [] : result.errors ?? [];
        await prisma_1.prisma.updateLog.update({
            where: { id: log.id },
            data: {
                status: errors.length ? "PARTIAL" : "SUCCESS",
                recordsTouched: touched,
                message: errors.join("; ") || null,
                finishedAt: new Date(),
            },
        });
        logger_1.logger.info(`Cron job "${name}" finished`, { touched, errors: errors.length });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger_1.logger.error(`Cron job "${name}" failed`, { error: message });
        await prisma_1.prisma.updateLog.update({
            where: { id: log.id },
            data: { status: "FAILURE", message, finishedAt: new Date() },
        });
    }
}
/**
 * Registers every scheduled ingestion job. Schedules are configurable via env
 * vars (see .env.example) so cadence can change without a code deploy.
 * Subscription ingestion additionally checks per-IPO status inside the
 * service itself, so it's a no-op for IPOs that aren't currently open.
 */
function startScheduledJobs() {
    if (!env_1.env.enableCron) {
        logger_1.logger.warn("Cron jobs disabled via ENABLE_CRON=false");
        return;
    }
    node_cron_1.default.schedule(env_1.env.cron.gmp, () => runJob("gmp", gmpService_1.ingestGmp));
    node_cron_1.default.schedule(env_1.env.cron.status, () => runJob("statuses", ipoService_1.refreshIpoStatuses));
    node_cron_1.default.schedule(env_1.env.cron.subscription, () => runJob("subscriptions", subscriptionService_1.ingestSubscriptions));
    node_cron_1.default.schedule(env_1.env.cron.upcoming, () => runJob("upcoming-ipos", ipoService_1.ingestUpcomingIpos));
    node_cron_1.default.schedule(env_1.env.cron.articles, () => runJob("articles", articleService_1.ingestArticles));
    node_cron_1.default.schedule(env_1.env.cron.reviews, () => runJob("reviews", reviewService_1.ingestReviews));
    logger_1.logger.info("Scheduled jobs registered", { ...env_1.env.cron });
}
