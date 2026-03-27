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

export async function browseListingsByUserId(id){
  const params = { id };
  const query = new URLSearchParams(params).toString();
  // use the utility for this

  const response = await apiClient(`/api/browse/user?${query}`, {
    method: "GET",
  });

  return response.data;
}
export async function browseListingsById(id){
  const params = { id };
  const query = new URLSearchParams(params).toString();
  // use the utility for this

  const response = await apiClient(`/api/browse/id?${query}`, {
    method: "GET",
  });

  return response.data;
}