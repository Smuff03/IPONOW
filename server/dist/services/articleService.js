"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestArticles = ingestArticles;
const prisma_1 = require("../utils/prisma.js");
const logger_1 = require("../utils/logger.js");
const adapters_1 = require("../adapters/index.js");
const sanitizeHtml_1 = require("../utils/sanitizeHtml.js");
async function ingestArticles() {
    const adapters = (0, adapters_1.getActiveAdapters)();
    let touched = 0;
    const errors = [];
    for (const adapter of adapters) {
        let records;
        try {
            records = await adapter.fetchArticles();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            logger_1.logger.error("Article adapter fetch failed", { error: message });
            errors.push(message);
            continue;
        }
        for (const record of records) {
            if (!record.source || !record.sourceUrl)
                continue;
            const relatedIpos = record.relatedIpoSlugs?.length
                ? await prisma_1.prisma.iPO.findMany({ where: { slug: { in: record.relatedIpoSlugs } }, select: { id: true } })
                : [];
            await prisma_1.prisma.article.upsert({
                where: { slug: record.slug },
                create: {
                    title: record.title,
                    slug: record.slug,
                    excerpt: record.excerpt,
                    content: (0, sanitizeHtml_1.sanitizeHtml)(record.content),
                    image: record.image,
                    category: record.category,
                    source: record.source,
                    sourceUrl: record.sourceUrl,
                    publishedAt: new Date(record.publishedAt),
                    status: "DRAFT", // ingested content stays in draft until an editor reviews & publishes it
                    relatedIpos: { connect: relatedIpos },
                },
                update: {
                    title: record.title,
                    excerpt: record.excerpt,
                    content: (0, sanitizeHtml_1.sanitizeHtml)(record.content),
                    image: record.image,
                    lastUpdated: new Date(),
                },
            });
            touched++;
        }
    }
    return { touched, errors };
}
