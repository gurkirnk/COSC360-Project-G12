import { Router } from "express";
import { createListing, editListing, deleteListing } from "./listController.js";
import { requireAuth } from "../auth/tokens/authMiddleware.js";

const listRoutes = Router();

listRoutes.post("/", requireAuth, createListing);
listRoutes.put("/", requireAuth, editListing);
listRoutes.delete("/", requireAuth, deleteListing);

export default listRoutes;