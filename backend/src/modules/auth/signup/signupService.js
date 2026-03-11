import { createUser, userExists } from "./signupRepository.js";

const MIN_PASSWORD_LENGTH = 6;
const MIN_USERNAME_LENGTH = 3;

export async function signup(username, password) {
    if (!username || !password) {
        throw Object.assign(new Error("Username and password are required."), { statusCode: 400 });
    }

    if (username.length < MIN_USERNAME_LENGTH) {
        throw Object.assign(new Error(`Username must be at least ${MIN_USERNAME_LENGTH} characters long.`), { statusCode: 400 });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
        throw Object.assign(new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`), { statusCode: 400 });
    }

    if (await userExists(username)) {
        throw Object.assign(new Error("Username already exists."), { statusCode: 409 });
    }

    return await createUser(username, password);
}