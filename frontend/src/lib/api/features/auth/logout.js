import { removeItem } from "../../../storage/fancySessionStorage";
import { AUTH_TOKEN } from "../../../storage/sessionStorageVariables";
import { apiClient } from "../../../api-client.js";

export async function logout() {
  try {
    await apiClient("/auth/logout", { method: "POST" });
  } catch (err) {
    console.error("Logout request failed:", err);
  }

  // Always remove local token
  removeItem(AUTH_TOKEN);
}
