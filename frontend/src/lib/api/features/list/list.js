import { apiClient } from "../../api-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function createListing({ title, genre, format, description }) {
  const response = await apiClient(`${API_BASE_URL}/api/list`, {
    method: "POST",
    body: {
      title,
      genre,
      format,
      description
    },
  });

  return response.data;
}
