import { apiClient } from "../../api-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function browseListings({ search, genre }) {
    console.log("Browsing...");
  const response = await apiClient(`${API_BASE_URL}/api/browse`, {
    method: "GET",
  });
  console.log("Browsed");
  return response.data;
}
