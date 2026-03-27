import { Router } from "express";
import { getListings, getListingsById } from "./browseController.js";

const browseRoutes = Router();

browseRoutes.get("/", getListings);
browseRoutes.get("/user", getListingsById);

export default browseRoutes;