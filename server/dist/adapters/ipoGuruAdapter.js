"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipoGuruAdapter = exports.IpoGuruAdapter = void 0;
const env_1 = require("../config/env.js");
const retry_1 = require("../utils/retry.js");
const BASE_URL = "https://www.ipoguru.in/api/v1";
const SOURCE_NAME = "IPO Guru";
const SOURCE_URL = "https://www.ipoguru.in/ipo-gmp-details-developer-api";
async function ipoGuruGet(params = {}) {
    if (!env_1.env.ipoGuru.apiKey) {
        throw new Error("IPOGURU_API_KEY is not set — add it to server/.env");
    }
    const qs = new URLSearchParams(params).toString();
    const url = `${BASE_URL}/ipos${qs ? `?${qs}` : ""}`;
    return (0, retry_1.withRetry)(async () => {
        const res = await fetch(url, { headers: { "X-API-KEY": env_1.env.ipoGuru.apiKey } });
        if (res.status === 429) {
            const body = (await res.json().catch(() => ({})));
            throw new Error(`IPO Guru rate limit hit: ${body.message ?? "429"}`);
        }
        if (!res.ok) {
            throw new Error(`IPO Guru request failed: ${res.status} ${res.statusText}`);
        }
        const json = (await res.json());
        if (!json.success)
            throw new Error("IPO Guru returned success:false");
        return json.data;
    }, { label: "IPO Guru /ipos", attempts: 3, timeoutMs: 10_000 });
}
function slugify(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
function parsePriceBand(band, issuePrice) {
    if (band) {
        const [min, max] = band.split("-").map((n) => parseInt(n.trim(), 10));
        if (!Number.isNaN(min) && !Number.isNaN(max))
            return { min, max };
    }
    const p = parseInt(issuePrice, 10) || 0;
    return { min: p, max: p };
}
function parseIssueSizeCr(raw) {
    if (!raw)
        return 0;
    const match = raw.replace(/,/g, "").match(/([\d.]+)/);
    return match ? parseFloat(match[1]) : 0;
}
function daysSince(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    return Math.max(1, Math.floor(diff / 86_400_000) + 1);
}
function normalizeIpo(item) {
    const { min, max } = parsePriceBand(item.price_band, item.issue_price);
    return {
        name: item.name.toLowerCase().includes("ipo") ? item.name : `${item.name} IPO`,
        slug: slugify(item.name),
        company: item.name,
        type: item.type === "SME" ? "SME" : "MAINBOARD",
        priceBandMin: min,
        priceBandMax: max,
        lotSize: parseInt(item.lot_size ?? "0", 10) || 0,
        issueSizeCr: parseIssueSizeCr(item.issue_size),
        openDate: item.open_date,
        closeDate: item.close_date,
        allotmentDate: item.allotment_date ?? undefined,
        listingDate: item.listing_date ?? undefined,
        registrar: item.registrar ?? undefined,
        leadManagers: [],
        source: SOURCE_NAME,
        sourceUrl: SOURCE_URL,
    };
}
class IpoGuruAdapter {
    async fetchUpcomingIPOs() {
        const items = await ipoGuruGet();
        return items.map(normalizeIpo);
    }
    async fetchGMP() {
        const items = await ipoGuruGet();
        return items
            .filter((item) => item.gmp?.price != null)
            .map((item) => ({
            ipoSlug: slugify(item.name),
            gmp: parseInt(item.gmp.price, 10) || 0,
            source: SOURCE_NAME,
        }));
    }
    async fetchSubscriptions() {
        const items = await ipoGuruGet({ status: "open" });
        return items
            .filter((item) => item.subscription?.total != null)
            .map((item) => ({
            ipoSlug: slugify(item.name),
            day: daysSince(item.open_date),
            qib: parseFloat(item.subscription.qib ?? "0") || 0,
            nii: parseFloat(item.subscription.nii ?? "0") || 0,
            retail: parseFloat(item.subscription.retail ?? "0") || 0,
            total: parseFloat(item.subscription.total ?? "0") || 0,
            source: SOURCE_NAME,
        }));
    }
    // IPO Guru's public API doesn't expose articles or review sentiment —
    // pair this adapter with another source for those, or leave them empty.
    async fetchArticles() {
        return [];
    }
    async fetchReviews() {
        return [];
    }
}
exports.IpoGuruAdapter = IpoGuruAdapter;
exports.ipoGuruAdapter = new IpoGuruAdapter();
