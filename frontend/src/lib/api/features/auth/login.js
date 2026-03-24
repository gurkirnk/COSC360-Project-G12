import { apiClient } from "../../api-client";

export async function loginUser({ email, password }) {
  try {
    const response = await apiClient(`/api/auth/login`, {
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
