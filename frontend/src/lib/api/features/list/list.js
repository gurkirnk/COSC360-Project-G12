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

export async function editListing({ title, genre, format, description, listingId }) {
  const response = await apiClient(`/api/list`, {
    method: "PUT",
    body: {
      title,
      genre,
      format,
      description,
      listingId
    },
  });

  return response.data;
}
