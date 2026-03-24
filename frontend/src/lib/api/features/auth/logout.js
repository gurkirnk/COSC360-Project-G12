import { apiClient } from "../../api-client.js";

export async function logout() {
  return apiClient(`/api/auth/logout`, { method: "POST" });
}
