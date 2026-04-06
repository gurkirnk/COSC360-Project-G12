import { Router } from "express";
import { adminStatus, adminRemoveUser } from "./adminController.js";
import { requireAdminAuth } from "../tokens/authMiddleware.js";

const adminRoutes = Router();

// GET /auth/admin - admin only demo
adminRoutes.get("/", requireAdminAuth, adminStatus);

adminRoutes.delete("/user", requireAdminAuth, adminRemoveUser);

export default adminRoutes;
