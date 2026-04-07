import { Router } from "express";
import { adminStatus, adminRemoveUser, adminDeleteListing, adminGetUser } from "./adminController.js";
import { requireAdminAuth } from "../tokens/authMiddleware.js";

const adminRoutes = Router();

// GET /auth/admin - admin only demo
adminRoutes.get("/", requireAdminAuth, adminStatus);

adminRoutes.get("/user", requireAdminAuth, adminGetUser);
adminRoutes.delete("/user", requireAdminAuth, adminRemoveUser);

adminRoutes.delete("/listing", requireAdminAuth, adminDeleteListing);

export default adminRoutes;
