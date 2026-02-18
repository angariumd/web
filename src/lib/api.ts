const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/v1";
const API_TOKEN = import.meta.env.VITE_API_TOKEN || "";

export async function apiRequest<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            "Authorization": `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || response.statusText);
    }

    const contentType = response.headers.get("content-type");

    if (response.status === 204 || (response.headers.get("content-length") === "0" && !contentType?.includes("text/plain"))) {
        return {} as T;
    }

    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return response.text() as unknown as T;
}

export const api = {
    jobs: {
        list: () => apiRequest<any[]>("/jobs"),
        submit: (data: any) => apiRequest("/jobs", { method: "POST", body: JSON.stringify(data) }),
        cancel: (id: string) => apiRequest(`/jobs/${id}/cancel`, { method: "POST" }),
        logs: (id: string, follow: boolean = false, signal?: AbortSignal) => {
            if (!follow) return apiRequest<string>(`/jobs/${id}/logs`);

            const url = `${API_BASE_URL}/jobs/${id}/logs?follow=true`;
            return fetch(url, {
                headers: {
                    "Authorization": `Bearer ${API_TOKEN}`,
                },
                signal
            });
        },
        events: (id: string) => apiRequest<any[]>(`/jobs/${id}/events`),
    },
    nodes: {
        list: () => apiRequest<any[]>("/nodes"),
    },
    whoami: () => apiRequest<{ id: string, name: string }>("/whoami"),
};
