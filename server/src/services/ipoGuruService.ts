import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { setJson } from "@/utils/redis";

/** The Redis key under which the full IPO list is cached. */
export const IPOGURU_IPOS_KEY = "ipoguru:ipos";

/**
 * 2 hours + 10 minutes in seconds — ensures the cache never expires before
 * the next scheduled run (every 2 h) picks up a fresh copy.
 */
const CACHE_TTL_SECONDS = 2 * 60 * 60 + 10 * 60; // 7800 s

interface IpoGuruGmp {
    price: string;
    percentage: string;
    kostak: string | null;
    subject_to_sauda: string;
    estimated_listing_price: number;
    updated_at: string;
    updated_at_label: string;
}

interface IpoGuruRecord {
    slug: string;
    name: string;
    display_name: string;
    type: string;
    sub_type: string;
    status: string;
    is_listed: boolean;
    logo: string;
    open_date: string | null;
    close_date: string | null;
    allotment_date: string | null;
    listing_date: string | null;
    price_band: string | null;
    price_min: number | null;
    price_max: number | null;
    issue_price: string | null;
    issue_size: string | null;
    lot_size: number | null;
    min_investment: number | null;
    gmp: IpoGuruGmp;
    subscription_total: number | null;
    listing_price: number | null;
    listing_gain_percent: number | null;
    cmp: number | null;
    current_gain_percent: number | null;
    web_url: string;
}

interface IpoGuruApiResponse {
    success: boolean;
    plan: string;
    count: number;
    data: IpoGuruRecord[];
}

/**
 * Fetches all IPOs from the IPO Guru API and stores them in Redis.
 * Called by the scheduler every 2 hours.
 *
 * Returns the scheduler-compatible { touched, errors } shape.
 */
export async function fetchAndCacheIposFromIpoGuru(): Promise<{
    touched: number;
    errors: string[];
}> {
    const errors: string[] = [];

    if (!env.ipoGuru.apiKey) {
        const msg = "IPOGURU_API_KEY is not set — skipping IPO Guru fetch";
        logger.warn(msg);
        return { touched: 0, errors: [msg] };
    }

    let response: Response;
    try {
        response = await fetch("https://www.ipoguru.in/api/v2/ipos", {
            method: "GET",
            headers: {
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "User-Agent": "EchoapiRuntime/1.1.0",
                "X-API-KEY": env.ipoGuru.apiKey,
                "Cache-Control": "no-cache",
            },
        });
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error("IPO Guru API network error", { error: message });
        return { touched: 0, errors: [message] };
    }

    if (!response.ok) {
        const message = `IPO Guru API returned HTTP ${response.status} ${response.statusText}`;
        logger.error(message);
        return { touched: 0, errors: [message] };
    }

    let body: IpoGuruApiResponse;
    try {
        body = (await response.json()) as IpoGuruApiResponse;
    } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger.error("IPO Guru API response parse error", { error: message });
        return { touched: 0, errors: [message] };
    }

    if (!body.success || !Array.isArray(body.data)) {
        const message = `Unexpected IPO Guru response shape: success=${body.success}`;
        logger.error(message);
        return { touched: 0, errors: [message] };
    }

    await setJson(IPOGURU_IPOS_KEY, body.data, CACHE_TTL_SECONDS);

    logger.info("IPO Guru data cached in Redis", {
        key: IPOGURU_IPOS_KEY,
        count: body.data.length,
        ttlSeconds: CACHE_TTL_SECONDS,
    });

    return { touched: body.data.length, errors };
}
