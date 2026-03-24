import { apiClient } from "../../api-client";

export async function browseListings({ search, genre }) {
  const params = { search, genre };
  const query = new URLSearchParams(params).toString();
  // use the utility for this

  const response = await apiClient(`/api/browse?${query}`, {
    method: "GET",
  });

  return response.data;
}
