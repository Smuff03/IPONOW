"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
exports.setJson = setJson;
exports.getJson = getJson;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env.js");
const logger_1 = require("./logger.js");
/**
 * Singleton ioredis client. All parts of the application share this one
 * connection — it reconnects automatically on failure.
 */
exports.redis = new ioredis_1.default(env_1.env.redisUrl, {
    maxRetriesPerRequest: 3,
    lazyConnect: false,
});
exports.redis.on("connect", () => logger_1.logger.info("Redis connected", { url: env_1.env.redisUrl }));
exports.redis.on("error", (err) => logger_1.logger.error("Redis error", { error: err.message }));
/** Serialise a value to JSON and store it with an optional TTL (seconds). */
async function setJson(key, value, ttlSeconds) {
    const payload = JSON.stringify(value);
    if (ttlSeconds) {
        await exports.redis.set(key, payload, "EX", ttlSeconds);
    }
    else {
        await exports.redis.set(key, payload);
    }
}
/** Retrieve and deserialise a JSON value stored at `key`. Returns `null` if missing. */
async function getJson(key) {
    const raw = await exports.redis.get(key);
    if (raw === null)
        return null;
    return JSON.parse(raw);
}
