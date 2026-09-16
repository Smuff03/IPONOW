"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger.js");
class ApiError extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.ApiError = ApiError;
function notFoundHandler(req, res) {
    res.status(404).json({ error: "Not found", path: req.originalUrl });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function errorHandler(err, req, res, _next) {
    const status = err instanceof ApiError ? err.status : 500;
    const message = err instanceof Error ? err.message : "Internal server error";
    if (status >= 500)
        logger_1.logger.error(message, { path: req.originalUrl, stack: err instanceof Error ? err.stack : undefined });
    res.status(status).json({ error: message });
}
