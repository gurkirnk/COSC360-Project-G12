import { Router } from "express";
import signupRoutes from "./signup/singupRoute.js";
import logoutRoutes from "./logout/logoutRoute.js";
import adminRoutes from "./admin/adminRoute.js";
import loginRoutes from "./login/loginRoute.js";

const authRoutes = Router();

authRoutes.use("/signup", signupRoutes);
authRoutes.use("/logout", logoutRoutes);
authRoutes.use("/admin", adminRoutes);
 authRoutes.use("/login", loginRoutes);

export default authRoutes;