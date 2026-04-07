import { apiClient } from "../../api-client";

export async function getUserById(id){
  const params = { id };
  const query = new URLSearchParams(params).toString();
  // use the utility for this

  const response = await apiClient(`/api/auth/admin/user/id?${query}`, {
    method: "GET",
  });

  return response.data;
}
export async function getUserByName(name){
  const params = { name };
  const query = new URLSearchParams(params).toString();
  // use the utility for this

  const response = await apiClient(`/api/auth/admin/user/name?${query}`, {
    method: "GET",
  });

  return response.data;
}
export async function getUserByEmail(email){
  const params = { email };
  const query = new URLSearchParams(params).toString();
  // use the utility for this

  const response = await apiClient(`/api/auth/admin/user/email?${query}`, {
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