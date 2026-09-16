"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma_1 = require("../utils/prisma.js");
const env_1 = require("../config/env.js");
const errorHandler_1 = require("../middleware/errorHandler.js");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
});
async function login(req, res) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success)
        throw new errorHandler_1.ApiError(400, "Invalid email or password format");
    const { email, password } = parsed.data;
    const user = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new errorHandler_1.ApiError(401, "Invalid credentials");
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        throw new errorHandler_1.ApiError(401, "Invalid credentials");
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email }, env_1.env.jwtSecret, {
        expiresIn: env_1.env.jwtExpiresIn,
    });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
