import { Router } from "express";
import { createListing, editListing, deleteListing } from "./listController.js";

const listRoutes = Router();

listRoutes.post("/", createListing);
listRoutes.put("/", editListing);
listRoutes.delete("/", deleteListing);

export default listRoutes;