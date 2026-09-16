"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoRetryError = void 0;
exports.withRetry = withRetry;
const logger_1 = require("./logger");
/**
 * Throw this from inside `withRetry`'s callback to fail immediately without
 * burning the remaining attempts — for errors a retry can never fix, such as
 * an invalid/missing API key (401/403). The message is preserved as-is.
 */
class NoRetryError extends Error {
}
exports.NoRetryError = NoRetryError;
/** Runs `fn` with retries, exponential backoff, and a per-attempt timeout. */
async function withRetry(fn, opts = {}) {
    const { attempts = 3, delayMs = 500, timeoutMs = 8000, label = "operation" } = opts;
    let lastError;
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            return await withTimeout(fn(), timeoutMs, label);
        }
        catch (err) {
            lastError = err;
            logger_1.logger.warn(`${label} failed on attempt ${attempt}/${attempts}`, {
                error: err instanceof Error ? err.message : String(err),
            });
            if (err instanceof NoRetryError)
                break;
            if (attempt < attempts) {
                await sleep(delayMs * attempt);
            }
        }
    }
    throw lastError;
}
function withTimeout(promise, ms, label) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
        promise
            .then((value) => {
            clearTimeout(timer);
            resolve(value);
        })
            .catch((err) => {
            clearTimeout(timer);
            reject(err);
        });
    });
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
