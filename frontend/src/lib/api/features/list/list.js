import { apiClient } from "../../api-client";

export async function createListing({ title, genre, format, description }) {
  const response = await apiClient(`/api/list`, {
    method: "POST",
    body: {
      title,
      genre,
      format,
      description,
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

export async function deleteListing(listingId){
  const response = await apiClient(`/api/list`, {
    method: "DELETE",
    body: {
      listingId
    },
  });

  return response.data;
}

export async function browseListings({ search, genre }) {
  const params = { search, genre };
  const query = new URLSearchParams(params).toString();
  // use the utility for this

  const response = await apiClient(`/api/list?${query}`, {
    method: "GET",
  });

  return response.data;
}

export async function browseListingsByUserId(id){
  const params = { id };
  const query = new URLSearchParams(params).toString();
  // use the utility for this

  const response = await apiClient(`/api/list/user?${query}`, {
    method: "GET",
  });

  return response.data;
}
export async function browseListingsById(id){
  const params = { id };
  const query = new URLSearchParams(params).toString();
  // use the utility for this

  const response = await apiClient(`/api/list/id?${query}`, {
    method: "GET",
  });

  return response.data;
}