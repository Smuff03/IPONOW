"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const env_1 = require("./config/env.js");
const rateLimiter_1 = require("./middleware/rateLimiter.js");
const errorHandler_1 = require("./middleware/errorHandler.js");
const ipoRoutes_1 = require("./routes/ipoRoutes.js");
const contentRoutes_1 = require("./routes/contentRoutes.js");
const authRoutes_1 = require("./routes/authRoutes.js");
const adminRoutes_1 = require("./routes/adminRoutes.js");
function createApp() {
    const app = (0, express_1.default)();
    app.disable("x-powered-by");
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: env_1.env.clientUrl,
        credentials: true,
    }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use((0, morgan_1.default)(env_1.env.nodeEnv === "production" ? "combined" : "dev"));
    app.get("/health", (_req, res) => res.json({ status: "ok", time: new Date().toISOString() }));
    // Public, read-only API — safe to expose without auth.
    app.use("/api", rateLimiter_1.apiRateLimiter, ipoRoutes_1.ipoRoutes);
    app.use("/api", rateLimiter_1.apiRateLimiter, contentRoutes_1.contentRoutes);
    // Auth + admin — admin routes are protected inside adminRoutes itself.
    app.use("/api/auth", rateLimiter_1.apiRateLimiter, authRoutes_1.authRoutes);
    app.use("/api/admin", adminRoutes_1.adminRoutes);
    app.use(errorHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
}
