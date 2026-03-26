import { apiClient } from "../../api-client";

export async function registerUser({ name, email, password, profilePicture = null }) {
  const response = await apiClient(`/api/auth/signup`, {
    method: "POST",
    body: {
      name,
      email,
      password,
      profilePicture,
    },
  });

  return response.data;
}
