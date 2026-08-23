import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { getAccessToken } from "./user";

export async function authFetch(
    input: RequestInfo | URL,
    init: RequestInit = {},
) {
    const token = await getAccessToken();

    if (!token) {
        throw new Error("Authentication required.");
    }

    const headers = new Headers(init.headers);

    headers.set("Authorization", `Bearer ${token}`);

    return fetch(
        input,
        {
            ...init,
            headers,
        },
    );
}