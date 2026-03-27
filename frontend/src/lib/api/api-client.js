import { getItem } from "../storage/fancyLocalStorage.js";
import { AUTH_TOKEN } from "../storage/localStorageVariables.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

function constructUrl(path) {
  return new URL(path, API_BASE_URL).toString();
}

export async function apiClient(url, options = {}) {
  const { method = "GET", body } = options;

  // Include the persisted bearer token when present.
  const token = getItem(AUTH_TOKEN, null);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(constructUrl(url), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const rawBody = await response.text();
  let data = null;

  if (rawBody) {
    try {
      data = JSON.parse(rawBody);
    } catch {
      data = { message: rawBody };
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.error ||
        data?.message ||
        `Request failed with status ${response.status}`
    );
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data ?? {};
}
