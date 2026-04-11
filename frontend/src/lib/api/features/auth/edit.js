import { apiClient } from "../../api-client";

export async function edit({ name, email, password, profilePicture = null, id }) {
  const response = await apiClient(`/api/auth/edit`, {
    method: "PUT",
    body: {
      name,
      email,
      password,
      profilePicture,
      id,
    },
  });

  return response.data;
}
