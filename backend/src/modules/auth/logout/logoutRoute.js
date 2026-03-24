import { Router } from "express";
import { logoutController } from "./logoutController.js";
import { requireAuth } from "../tokens/authMiddleware.js";

const logoutRoutes = Router();

// POST /auth/logout - client should remove token on success
logoutRoutes.post("/", requireAuth, logoutController);

export default logoutRoutes;
