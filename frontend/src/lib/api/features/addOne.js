import { apiClient } from "../api-client";

export async function addOneApi() {
    const res = await apiClient(`/api/counter/increment`, {
        method: "POST",
    });

    return res.data;
}
