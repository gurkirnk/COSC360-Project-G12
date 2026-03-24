import { Router } from "express";
import { adminController } from "./adminController.js";
import { requireAdminAuth } from "../tokens/authMiddleware.js";

const adminRoutes = Router();

// GET /auth/admin - admin only demo
adminRoutes.get("/", requireAdminAuth, adminController);

export default adminRoutes;
