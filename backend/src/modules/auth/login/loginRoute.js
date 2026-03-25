import { Router } from "express";
import { loginController } from "./loginController.js";

const loginRoutes = Router();

loginRoutes.post("/", loginController);

export default loginRoutes;