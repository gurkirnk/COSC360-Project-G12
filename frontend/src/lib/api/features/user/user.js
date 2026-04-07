import { apiClient } from "../../api-client";

export async function getUserById(id){
  const params = { id };
  const query = new URLSearchParams(params).toString();
  // use the utility for this

  const response = await apiClient(`/api/auth/admin/user?${query}`, {
    method: "GET",
  });

  return response.data;
}
export async function deleteUser(id){
 const response = await apiClient(`/api/auth/admin/user`, {
    method: "DELETE",
    body: {
      id
    },
  });

  return response.data;
}