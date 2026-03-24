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

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
    }

    return data;
}