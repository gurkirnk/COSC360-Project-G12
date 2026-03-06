import { Router } from "express";
import { incrementCounter } from "./counterController.js";

const counterRoutes = Router();

counterRoutes.post("/increment", incrementCounter);

export default counterRoutes;
