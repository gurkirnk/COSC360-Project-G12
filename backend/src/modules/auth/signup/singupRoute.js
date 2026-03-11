import { Router } from "express";
import { signupController } from "./signupController.js";

const signupRoutes = Router();

signupRoutes.post("/", signupController);

export default signupRoutes;