import { Router } from "express";
import { createListing, editListing, deleteListing, getListings, getListingsById, getListingsByUserId } from "./listController.js";
import { requireAuth } from "../auth/tokens/authMiddleware.js";

const listRoutes = Router();

listRoutes.get("/", getListings);
listRoutes.get("/user", getListingsByUserId);
listRoutes.get("/id", getListingsById);

listRoutes.post("/", requireAuth, createListing);
listRoutes.put("/", requireAuth, editListing);
listRoutes.delete("/", requireAuth, deleteListing);

export default listRoutes;