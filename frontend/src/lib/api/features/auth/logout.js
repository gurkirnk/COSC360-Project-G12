import { apiClient } from "../../api-client.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function logout() {
  return apiClient(`${API_BASE_URL}/api/auth/logout`, { method: "POST" });
}
