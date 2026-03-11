import { Router } from "express";
import signupRoutes from "./signup/singupRoute.js";
// import loginRoutes from "./login/loginRoute.js";

const authRoutes = Router();

authRoutes.use("/signup", signupRoutes);
// authRoutes.use("/login", loginRoutes);

export default authRoutes;