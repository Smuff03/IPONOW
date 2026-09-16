"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestReviews = ingestReviews;
const prisma_1 = require("../utils/prisma.js");
const logger_1 = require("../utils/logger.js");
const adapters_1 = require("../adapters/index.js");
/**
 * Ingests aggregate sentiment counts only — never full review text — from
 * sources whose terms permit reuse. See adapters/README.md before adding a
 * new review source.
 */
async function ingestReviews() {
    const adapters = (0, adapters_1.getActiveAdapters)();
    let touched = 0;
    const errors = [];
    for (const adapter of adapters) {
        let records;
        try {
            records = await adapter.fetchReviews();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logger_1.logger.error("Review adapter fetch failed", { error: message });
            errors.push(message);
            continue;
        }
        for (const record of records) {
            if (!record.source || !record.sourceUrl)
                continue;
            const ipo = await prisma_1.prisma.iPO.findUnique({ where: { slug: record.ipoSlug } });
            if (!ipo)
                continue;
            const existing = await prisma_1.prisma.review.findFirst({ where: { ipoId: ipo.id, source: record.source } });
            const data = {
                sentiment: record.sentiment,
                positivePct: record.positivePct,
                neutralPct: record.neutralPct,
                negativePct: record.negativePct,
                reviewCount: record.reviewCount,
                sourceUrl: record.sourceUrl,
                lastUpdated: new Date(),
                isStale: false,
            };
            if (existing) {
                await prisma_1.prisma.review.update({ where: { id: existing.id }, data });
            }
            else {
                await prisma_1.prisma.review.create({ data: { ipoId: ipo.id, source: record.source, ...data } });
            }
            touched++;
        }
    }
    return { touched, errors };
}
