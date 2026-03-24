import { verifyToken } from "./jwt.js";
import { USER, ADMIN } from "../roles.js";

function sendAuthError(res, code, message) {
  return res.status(code).json({ message });
}

export function requireAuthRole(requiredRole) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return sendAuthError(res, 401, "Authorization header missing");
    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return sendAuthError(res, 401, "Invalid authorization format");
    const token = parts[1];
    const payload = verifyToken(token);
    if (!payload) return sendAuthError(res, 401, "Invalid or expired token");
    if (requiredRole && payload.role !== requiredRole) return sendAuthError(res, 403, `${requiredRole} privileges required`);
    req.user = payload;
    return next();
  };
}

export const requireAuth = requireAuthRole(USER);
export const requireAdminAuth = requireAuthRole(ADMIN);