import { findUserCredentialsByEmail } from "../authAndUserRepository.js";
import { signToken } from "../tokens/jwt.js";
import bcrypt from "bcrypt";

export async function login({ email, password }) {
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const normalizedPassword = typeof password === "string" ? password : "";

    if (!normalizedEmail || !normalizedPassword) {
        throw Object.assign(new Error("Email and password are required."), { statusCode: 400 });
    }

    const user = await findUserCredentialsByEmail(normalizedEmail);
    if (!user) {
        throw Object.assign(new Error("Invalid email or password."), { statusCode: 401 });
    }
    
    const passwordMatch = await bcrypt.compare(normalizedPassword, user.hashedPassword);
    if (!passwordMatch) {
        throw Object.assign(new Error("Invalid email or password."), { statusCode: 401 });
    }

    const token = signToken({ sub: user.id, name: user.name, role: user.role }, { expiresIn: "7d" });

    const { hashedPassword, ...publicUser } = user;

    return { user: publicUser, token };
}
