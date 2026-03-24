import { apiClient } from "../../api-client";

export async function registerUser({ name, email, password }) {
  const response = await apiClient(`/api/auth/signup`, {
    method: "POST",
    body: {
      name,
      email,
      password,
      //TODO: send the pfp in some way
    },
  });

  return response.data;
}
