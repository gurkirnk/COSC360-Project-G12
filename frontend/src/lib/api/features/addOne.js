import { apiClient } from "../api-client";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export async function addOneApi() {
    const res = await apiClient(`${API_BASE_URL}/api/counter/increment`, {
        method: "POST",
    });

    return res.data;
}