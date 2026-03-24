import { getItem } from "../storage/fancySessionStorage.js";
import { AUTH_TOKEN } from "../storage/sessionStorageVariables.js";

export async function apiClient(url, options = {}) {
  const { method = "GET", body } = options;

      // Include stored bearer token from session storage when present.
  const token = getItem(AUTH_TOKEN, null);
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
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
