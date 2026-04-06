import { Router } from "express";
import { adminStatus, adminRemoveUser, adminDeleteListing } from "./adminController.js";
import { requireAdminAuth } from "../tokens/authMiddleware.js";

const adminRoutes = Router();

// GET /auth/admin - admin only demo
adminRoutes.get("/", requireAdminAuth, adminStatus);

adminRoutes.delete("/user", requireAdminAuth, adminRemoveUser);

adminRoutes.delete("/listing", requireAdminAuth, adminDeleteListing)

export default adminRoutes;
