export async function apiClient(url, options = {}) {
    const { method = "GET", body } = options;

    const headers = {
        "Content-Type": "application/json",
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