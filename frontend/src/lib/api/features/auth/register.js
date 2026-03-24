import { apiClient } from "../../api-client";
import { AUTH_TOKEN } from "../../../storage/sessionStorageVariables";
import { setItem } from "../../../storage/fancySessionStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function registerUser({ name, email, password }) {
  const response = await apiClient(`${API_BASE_URL}/api/auth/signup`, {
    method: "POST",
    body: {
      name,
      email,
      password,
      //TODO: send the pfp in some way
    },
  });

  setItem(AUTH_TOKEN, response.data.token);
  return response.data;
}
