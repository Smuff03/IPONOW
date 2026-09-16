"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler.js");
const rateLimiter_1 = require("../middleware/rateLimiter.js");
const authController_1 = require("../controllers/authController.js");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post("/login", rateLimiter_1.loginRateLimiter, (0, asyncHandler_1.asyncHandler)(authController_1.login));
