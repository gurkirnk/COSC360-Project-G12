import { Router } from "express";
import { adminStatus, adminRemoveUser, adminDeleteListing, adminGetUser, adminGetUserByName, adminGetUserByEmail } from "./adminController.js";
import { requireAdminAuth } from "../tokens/authMiddleware.js";

const adminRoutes = Router();

// GET /auth/admin - admin only demo
adminRoutes.get("/", requireAdminAuth, adminStatus);

//TODO: These gets should probably be moved out of the admin auth folder, but in the interest of time, I'm leaving them here
adminRoutes.get("/user/id",  adminGetUser);
adminRoutes.get("/user/name",  adminGetUserByName);
adminRoutes.get("/user/email",  adminGetUserByEmail);
adminRoutes.delete("/user", requireAdminAuth, adminRemoveUser);

adminRoutes.delete("/listing", requireAdminAuth, adminDeleteListing);

export default adminRoutes;
