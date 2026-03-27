import { Router } from "express";
import { getListings, getListingsByUserId, getListingsById } from "./browseController.js";
import { requireAuth } from "../auth/tokens/authMiddleware.js";

const browseRoutes = Router();

browseRoutes.get("/", requireAuth, getListings);
browseRoutes.get("/user", requireAuth, getListingsByUserId);
browseRoutes.get("/id", requireAuth, getListingsById);

export default browseRoutes;