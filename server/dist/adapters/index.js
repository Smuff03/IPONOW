"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveAdapters = getActiveAdapters;
const mockSourceAdapter_1 = require("./mockSourceAdapter");
const rapidApiIpoAdapter_1 = require("./rapidApiIpoAdapter");
const ipoGuruAdapter_1 = require("./ipoGuruAdapter");
const env_1 = require("../config/env.js");
/**
 * Central registry of active adapters. In production, resolve this list from
 * enabled rows in the DataSource table instead of a static array, so sources
 * can be toggled from the admin dashboard without a redeploy.
 *
 * Preference order when multiple keys are configured: IPO Guru (direct,
 * documented, lower latency) > RapidAPI wrapper > mock fallback.
 */
function getActiveAdapters() {
    const adapters = [];
    if (env_1.env.ipoGuru.apiKey)
        adapters.push(ipoGuruAdapter_1.ipoGuruAdapter);
    if (env_1.env.rapidApi.key)
        adapters.push(rapidApiIpoAdapter_1.rapidApiIpoAdapter);
    if (adapters.length === 0)
        adapters.push(mockSourceAdapter_1.mockSourceAdapter);
    return adapters;
}
