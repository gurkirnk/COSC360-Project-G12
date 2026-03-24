import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(payload, options = {}) {
  const opts = { algorithm: "HS256", ...options };
  return jwt.sign(payload, SECRET, opts);
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET, { algorithms: ["HS256"] });
  } catch (err) {
    return null;
  }
}
