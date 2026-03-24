import { apiClient } from "../../api-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function loginUser({ email, password }) {
  try {
    const response = await apiClient(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      body: {
        email,
        password,
      },
    });

    return response.data;
  } catch (error) {
    if (error.status === 404) {
      throw new Error("Login is not available yet because the backend login route is not implemented.");
    }

    throw error;
  }
}
