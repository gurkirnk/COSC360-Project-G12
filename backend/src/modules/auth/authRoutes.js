import { Router } from "express";
import signupRoutes from "./signup/singupRoute.js";
import logoutRoutes from "./logout/logoutRoute.js";
import adminRoutes from "./admin/adminRoute.js";
import loginRoutes from "./login/loginRoute.js";
import editRoutes from "./edit/editRoute.js";

const authRoutes = Router();

authRoutes.use("/signup", signupRoutes);
authRoutes.use("/logout", logoutRoutes);
authRoutes.use("/admin", adminRoutes);
 authRoutes.use("/login", loginRoutes);
 authRoutes.use("/edit", editRoutes);

export default authRoutes;