"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env.js");
const app_1 = require("./app.js");
const scheduler_1 = require("./jobs/scheduler.js");
const adapters_1 = require("./adapters/index.js");
const logger_1 = require("./utils/logger.js");
const app = (0, app_1.createApp)();
app.listen(env_1.env.port, () => {
    logger_1.logger.info(`Server listening on port ${env_1.env.port}`, { env: env_1.env.nodeEnv });
    // Diagnostic: confirms which data source(s) this process actually resolved
    // at boot, and whether RAPIDAPI_KEY/IPOGURU_API_KEY were read from .env —
    // check this first if the UI is showing data you didn't expect.
    const adapterNames = (0, adapters_1.getActiveAdapters)().map((a) => a.constructor.name);
    logger_1.logger.info(`Active source adapter(s): ${adapterNames.join(", ")}`, {
        rapidApiKeySet: Boolean(env_1.env.rapidApi.key),
        rapidApiKeyLength: env_1.env.rapidApi.key.length,
        ipoGuruKeySet: Boolean(env_1.env.ipoGuru.apiKey),
    });
    (0, scheduler_1.startScheduledJobs)();
});
