import { Router } from "express";
import { createListing } from "./listController.js";

const listRoutes = Router();

listRoutes.post("/", createListing);

export default listRoutes;