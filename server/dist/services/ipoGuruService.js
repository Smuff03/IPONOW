"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPOGURU_IPOS_KEY = void 0;
exports.fetchAndCacheIposFromIpoGuru = fetchAndCacheIposFromIpoGuru;
const env_1 = require("../config/env.js");
const logger_1 = require("../utils/logger.js");
const redis_1 = require("../utils/redis.js");
/** The Redis key under which the full IPO list is cached. */
exports.IPOGURU_IPOS_KEY = "ipoguru:ipos";
/**
 * 2 hours + 10 minutes in seconds — ensures the cache never expires before
 * the next scheduled run (every 2 h) picks up a fresh copy.
 */
const CACHE_TTL_SECONDS = 2 * 60 * 60 + 10 * 60; // 7800 s
/**
 * Fetches all IPOs from the IPO Guru API and stores them in Redis.
 * Called by the scheduler every 2 hours.
 *
 * Returns the scheduler-compatible { touched, errors } shape.
 */
async function fetchAndCacheIposFromIpoGuru() {
    const errors = [];
    if (!env_1.env.ipoGuru.apiKey) {
        const msg = "IPOGURU_API_KEY is not set — skipping IPO Guru fetch";
        logger_1.logger.warn(msg);
        return { touched: 0, errors: [msg] };
    }
    let response;
    try {
        response = await fetch("https://www.ipoguru.in/api/v2/ipos", {
            method: "GET",
            headers: {
                Accept: "*/*",
                "Accept-Encoding": "gzip, deflate, br",
                "User-Agent": "EchoapiRuntime/1.1.0",
                "X-API-KEY": env_1.env.ipoGuru.apiKey,
                "Cache-Control": "no-cache",
            },
        });
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger_1.logger.error("IPO Guru API network error", { error: message });
        return { touched: 0, errors: [message] };
    }
    if (!response.ok) {
        const message = `IPO Guru API returned HTTP ${response.status} ${response.statusText}`;
        logger_1.logger.error(message);
        return { touched: 0, errors: [message] };
    }
    let body;
    try {
        body = (await response.json());
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logger_1.logger.error("IPO Guru API response parse error", { error: message });
        return { touched: 0, errors: [message] };
    }
    if (!body.success || !Array.isArray(body.data)) {
        const message = `Unexpected IPO Guru response shape: success=${body.success}`;
        logger_1.logger.error(message);
        return { touched: 0, errors: [message] };
    }
    await (0, redis_1.setJson)(exports.IPOGURU_IPOS_KEY, body.data, CACHE_TTL_SECONDS);
    logger_1.logger.info("IPO Guru data cached in Redis", {
        key: exports.IPOGURU_IPOS_KEY,
        count: body.data.length,
        ttlSeconds: CACHE_TTL_SECONDS,
    });
    return { touched: body.data.length, errors };
}
