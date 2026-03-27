import { Router } from "express";
import { createListing, editListing } from "./listController.js";

const listRoutes = Router();

listRoutes.post("/", createListing);
listRoutes.put("/", editListing)

export default listRoutes;