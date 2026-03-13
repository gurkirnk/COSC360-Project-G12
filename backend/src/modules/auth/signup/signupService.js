import { createUser, findUserByName, findUserByEmail } from "./signupRepository.js";

const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 3;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signup({ name, email, password }) {
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedPassword = typeof password === "string" ? password : "";

  if (!normalizedName || !normalizedEmail || !normalizedPassword) {
    throw Object.assign(new Error("Name, email, and password are required."), { statusCode: 400 });
  }

  if (normalizedName.length < MIN_NAME_LENGTH) {
    throw Object.assign(new Error(`Name must be at least ${MIN_NAME_LENGTH} characters long.`), { statusCode: 400 });
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw Object.assign(new Error("A valid email address is required."), { statusCode: 400 });
  }

  if (normalizedPassword.length < MIN_PASSWORD_LENGTH) {
    throw Object.assign(new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`), { statusCode: 400 });
  }

  if (await findUserByEmail(normalizedEmail)) {
    throw Object.assign(new Error("User already exists with this email."), { statusCode: 409 });
  }
  if (await findUserByName(normalizedName)) {
    throw Object.assign(new Error("User already exists with this name."), { statusCode: 409 });
  }

  return await createUser({
    name: normalizedName,
    email: normalizedEmail,
    password: normalizedPassword,
  });
}
