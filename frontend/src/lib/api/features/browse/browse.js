import { apiClient } from "../../api-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function browseListings({ search, genre }) {
  const url = new URL(`${API_BASE_URL}/api/browse`);
  const params = {search: search, genre: genre};
  url.search = new URLSearchParams(params).toString();
  const response = await apiClient(url, {
    method: "GET",
  });
  return response.data;
}
