"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env.js");
const errorHandler_1 = require("./errorHandler");
/** Protects /api/admin/* routes. Never mount this on public-facing routes. */
function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(new errorHandler_1.ApiError(401, "Missing or malformed Authorization header"));
    }
    const token = header.slice("Bearer ".length);
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        req.user = payload;
        next();
    }
    catch {
        next(new errorHandler_1.ApiError(401, "Invalid or expired token"));
    }
}
function requireAdmin(req, res, next) {
    if (req.user?.role !== "ADMIN")
        return next(new errorHandler_1.ApiError(403, "Admin access required"));
    next();
}
