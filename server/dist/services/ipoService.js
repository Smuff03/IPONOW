"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upsertIpoRecord = upsertIpoRecord;
exports.refreshIpoStatuses = refreshIpoStatuses;
exports.ingestUpcomingIpos = ingestUpcomingIpos;
const prisma_1 = require("../utils/prisma.js");
const logger_1 = require("../utils/logger.js");
const adapters_1 = require("../adapters/index.js");
function computeStatus(openDate, closeDate, listingDate, now = new Date()) {
    if (listingDate && now >= listingDate)
        return "LISTED";
    if (now < openDate)
        return "UPCOMING";
    const isLastDay = now.toDateString() === closeDate.toDateString();
    if (now > closeDate)
        return "CLOSED";
    return isLastDay ? "CLOSING_TODAY" : "OPEN";
}
/** Upserts one IPO record, marking it fresh. Called by the ingestion job and by the admin "manual add" flow. */
async function upsertIpoRecord(record) {
    const openDate = new Date(record.openDate);
    const closeDate = new Date(record.closeDate);
    const listingDate = record.listingDate ? new Date(record.listingDate) : null;
    return prisma_1.prisma.iPO.upsert({
        where: { slug: record.slug },
        create: {
            name: record.name,
            slug: record.slug,
            company: record.company,
            type: record.type,
            priceBandMin: record.priceBandMin,
            priceBandMax: record.priceBandMax,
            lotSize: record.lotSize,
            issueSizeCr: record.issueSizeCr,
            openDate,
            closeDate,
            allotmentDate: record.allotmentDate ? new Date(record.allotmentDate) : null,
            refundDate: record.refundDate ? new Date(record.refundDate) : null,
            demateDate: record.demateDate ? new Date(record.demateDate) : null,
            listingDate,
            status: computeStatus(openDate, closeDate, listingDate),
            registrar: record.registrar,
            registrarUrl: record.registrarUrl,
            leadManagers: record.leadManagers ?? [],
            about: record.about,
            strengths: record.strengths ?? [],
            risks: record.risks ?? [],
            logo: record.logo,
            expectedSubscription: record.expectedSubscription,
            estimatedListing: record.estimatedListing,
            source: record.source,
            sourceUrl: record.sourceUrl,
            lastUpdated: new Date(),
            isStale: false,
        },
        update: {
            name: record.name,
            company: record.company,
            priceBandMin: record.priceBandMin,
            priceBandMax: record.priceBandMax,
            lotSize: record.lotSize,
            issueSizeCr: record.issueSizeCr,
            openDate,
            closeDate,
            allotmentDate: record.allotmentDate ? new Date(record.allotmentDate) : undefined,
            listingDate,
            status: computeStatus(openDate, closeDate, listingDate),
            registrar: record.registrar,
            registrarUrl: record.registrarUrl,
            leadManagers: record.leadManagers ?? undefined,
            about: record.about,
            logo: record.logo ?? undefined,
            expectedSubscription: record.expectedSubscription ?? undefined,
            estimatedListing: record.estimatedListing ?? undefined,
            source: record.source,
            sourceUrl: record.sourceUrl,
            lastUpdated: new Date(),
            isStale: false,
        },
    });
}
/** Recomputes status for all IPOs based on the current time — run every 30 min alongside GMP. */
async function refreshIpoStatuses() {
    const ipos = await prisma_1.prisma.iPO.findMany();
    let touched = 0;
    for (const ipo of ipos) {
        const status = computeStatus(ipo.openDate, ipo.closeDate, ipo.listingDate);
        if (status !== ipo.status) {
            await prisma_1.prisma.iPO.update({ where: { id: ipo.id }, data: { status } });
            touched++;
        }
    }
    return touched;
}
/**
 * Pulls upcoming IPO listings from every active adapter. If an adapter fails,
 * previously ingested IPOs are left untouched (not deleted, not nulled) — we
 * only ever add/update records we could actually fetch.
 */
async function ingestUpcomingIpos() {
    const adapters = (0, adapters_1.getActiveAdapters)();
    let touched = 0;
    const errors = [];
    for (const adapter of adapters) {
        try {
            const records = await adapter.fetchUpcomingIPOs();
            for (const record of records) {
                if (!record.source || !record.sourceUrl) {
                    logger_1.logger.warn("Skipping IPO record missing source attribution", { slug: record.slug });
                    continue;
                }
                await upsertIpoRecord(record);
                touched++;
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logger_1.logger.error("IPO adapter fetch failed; retaining existing data", { error: message });
            errors.push(message);
        }
    }
    return { touched, errors };
}
