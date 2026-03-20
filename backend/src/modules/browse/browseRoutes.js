import { Router } from "express";
import { getListings } from "./browseController.js";

const browseRoutes = Router();

browseRoutes.get("/", getListings);

export default browseRoutes;