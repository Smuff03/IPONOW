"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestGmp = ingestGmp;
const prisma_1 = require("../utils/prisma.js");
const logger_1 = require("../utils/logger.js");
const adapters_1 = require("../adapters/index.js");
function trendFor(newGmp, previousGmp) {
    if (newGmp > previousGmp)
        return "UP";
    if (newGmp < previousGmp)
        return "DOWN";
    return "FLAT";
}
/**
 * Refreshes GMP for every IPO from active adapters. On a per-adapter failure,
 * the previously stored GMP is kept and the IPO is flagged `isStale: true`
 * instead of being overwritten with a fabricated or null value.
 */
async function ingestGmp() {
    const adapters = (0, adapters_1.getActiveAdapters)();
    let touched = 0;
    let staled = 0;
    const errors = [];
    for (const adapter of adapters) {
        let records;
        try {
            records = await adapter.fetchGMP();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logger_1.logger.error("GMP adapter fetch failed", { error: message });
            errors.push(message);
            continue;
        }
        for (const record of records) {
            if (!record.source)
                continue;
            const ipo = await prisma_1.prisma.iPO.findUnique({ where: { slug: record.ipoSlug } });
            if (!ipo)
                continue;
            const trend = trendFor(record.gmp, ipo.gmp);
            await prisma_1.prisma.iPO.update({
                where: { id: ipo.id },
                data: { gmp: record.gmp, gmpTrend: trend, lastUpdated: new Date(), isStale: false },
            });
            await prisma_1.prisma.gMPHistory.create({
                data: { ipoId: ipo.id, gmp: record.gmp, source: record.source },
            });
            touched++;
        }
    }
    // Mark IPOs untouched by any adapter this cycle as stale rather than guessing new values.
    const staleThreshold = new Date(Date.now() - 60 * 60 * 1000);
    const staleResult = await prisma_1.prisma.iPO.updateMany({
        where: { lastUpdated: { lt: staleThreshold }, isStale: false, status: { in: ["OPEN", "CLOSING_TODAY"] } },
        data: { isStale: true },
    });
    staled = staleResult.count;
    return { touched, staled, errors };
}
