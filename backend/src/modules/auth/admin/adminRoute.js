import { Router } from "express";
import { adminStatus, adminRemoveUser, adminDeleteListing, adminGetUser, adminGetUserByName, adminGetUserByEmail } from "./adminController.js";
import { requireAdminAuth } from "../tokens/authMiddleware.js";

const adminRoutes = Router();

// GET /auth/admin - admin only demo
adminRoutes.get("/", requireAdminAuth, adminStatus);

adminRoutes.get("/user/id", requireAdminAuth, adminGetUser);
adminRoutes.get("/user/name", requireAdminAuth, adminGetUserByName);
adminRoutes.get("/user/email", requireAdminAuth, adminGetUserByEmail);
adminRoutes.delete("/user", requireAdminAuth, adminRemoveUser);

adminRoutes.delete("/listing", requireAdminAuth, adminDeleteListing);

export default adminRoutes;
