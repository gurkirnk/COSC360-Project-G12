import { Router } from "express";
import { getListings, getListingsByUserId, getListingsById } from "./browseController.js";

const browseRoutes = Router();

browseRoutes.get("/", getListings);
browseRoutes.get("/user", getListingsByUserId);
browseRoutes.get("/id", getListingsById)

export default browseRoutes;