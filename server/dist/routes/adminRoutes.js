"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler.js");
const auth_1 = require("../middleware/auth.js");
const adminController_1 = require("../controllers/adminController.js");
exports.adminRoutes = (0, express_1.Router)();
// Every route below requires a valid admin JWT — never mount adminRoutes without these guards.
exports.adminRoutes.use(auth_1.requireAuth, auth_1.requireAdmin);
exports.adminRoutes.get("/ipos", (0, asyncHandler_1.asyncHandler)(adminController_1.adminListIpos));
exports.adminRoutes.post("/ipos", (0, asyncHandler_1.asyncHandler)(adminController_1.adminCreateOrUpdateIpo));
exports.adminRoutes.delete("/ipos/:id", (0, asyncHandler_1.asyncHandler)(adminController_1.adminDeleteIpo));
exports.adminRoutes.patch("/ipos/:id/gmp", (0, asyncHandler_1.asyncHandler)(adminController_1.adminEditGmp));
exports.adminRoutes.patch("/ipos/:id/subscription", (0, asyncHandler_1.asyncHandler)(adminController_1.adminEditSubscription));
exports.adminRoutes.get("/articles", (0, asyncHandler_1.asyncHandler)(adminController_1.adminListArticles));
exports.adminRoutes.post("/articles", (0, asyncHandler_1.asyncHandler)(adminController_1.adminCreateOrUpdateArticle));
exports.adminRoutes.delete("/articles/:id", (0, asyncHandler_1.asyncHandler)(adminController_1.adminDeleteArticle));
exports.adminRoutes.get("/sources", (0, asyncHandler_1.asyncHandler)(adminController_1.adminListDataSources));
exports.adminRoutes.patch("/sources/:id", (0, asyncHandler_1.asyncHandler)(adminController_1.adminToggleDataSource));
exports.adminRoutes.get("/allotment-sources", (0, asyncHandler_1.asyncHandler)(adminController_1.adminListAllotmentSources));
exports.adminRoutes.post("/allotment-sources", (0, asyncHandler_1.asyncHandler)(adminController_1.adminCreateAllotmentSource));
exports.adminRoutes.delete("/allotment-sources/:id", (0, asyncHandler_1.asyncHandler)(adminController_1.adminDeleteAllotmentSource));
exports.adminRoutes.get("/logs", (0, asyncHandler_1.asyncHandler)(adminController_1.adminListUpdateLogs));
exports.adminRoutes.post("/trigger/:job", (0, asyncHandler_1.asyncHandler)(adminController_1.adminTriggerJob));
// Manual "Sync Now" — runs the RapidAPI → Database pipeline immediately.
exports.adminRoutes.post("/sync-now", (0, asyncHandler_1.asyncHandler)(adminController_1.adminSyncNow));
