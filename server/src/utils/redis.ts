import Redis from "ioredis";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";

/**
 * Singleton ioredis client. All parts of the application share this one
 * connection — it reconnects automatically on failure.
 */
export const redis = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: false,
});

redis.on("connect", () => logger.info("Redis connected", { url: env.redisUrl }));
redis.on("error", (err) => logger.error("Redis error", { error: err.message }));

/** Serialise a value to JSON and store it with an optional TTL (seconds). */
export async function setJson(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
        await redis.set(key, payload, "EX", ttlSeconds);
    } else {
        await redis.set(key, payload);
    }
}

/** Retrieve and deserialise a JSON value stored at `key`. Returns `null` if missing. */
export async function getJson<T>(key: string): Promise<T | null> {
    const raw = await redis.get(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
}
