import { apiClient } from "../../api-client";

export async function createListing({ title, genre, format, description, userId }) {
  const response = await apiClient(`/api/list`, {
    method: "POST",
    body: {
      title,
      genre,
      format,
      description,
      userId
    },
  });

  return response.data;
}
