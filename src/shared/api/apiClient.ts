import {
    SessionExpiredError,
    tokenRefreshService,
} from "@/features/auth/infrastructure/api/TokenRefreshService";

/**
 * API base URL. By default it points at the deployed chess server, but you can
 * override it per environment by setting EXPO_PUBLIC_API_BASE_URL in your
 * Expo config (`app.json` `extra` / `env`) — handy for local/debug builds:
 *   expo config:extra:API_BASE_URL=http://localhost:3000
 */
export const API_BASE_URL =
  (process as { env?: { EXPO_PUBLIC_API_BASE_URL?: string } } | undefined)?.env
    ?.EXPO_PUBLIC_API_BASE_URL ?? "https://server-1-teud.onrender.com";

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

type ApiRequestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
    /** Set false for public endpoints (no Authorization header). */
    auth?: boolean;
};

async function authHeaders(): Promise<Record<string, string>> {
    const token = await tokenRefreshService.getValidAccessToken();
    return { Authorization: `Bearer ${token}` };
}

async function handleResponse<T>(response: Response): Promise<T> {
    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            typeof body === "object" &&
            body !== null &&
            "message" in body &&
            typeof body.message === "string"
                ? body.message
                : `Request failed (HTTP ${response.status})`;

        throw new ApiError(response.status, message);
    }

    return body as T;
}

/**
 * Typed fetch helper around the chess server.
 * - Attaches a valid access token (refreshing when needed) for authenticated requests.
 * - Retries once after a force-refresh when the server rejects a 401.
 * - Sends multipart bodies (FormData) without a content type so fetch sets the boundary.
 */
export async function apiRequest<T>(
    path: string,
    options: ApiRequestOptions = {},
): Promise<T> {
    const { method = "GET", headers = {}, body, auth = true } = options;

    const requestHeaders: Record<string, string> = { ...headers };
    const isFormData = body instanceof FormData;

    if (!isFormData) {
        requestHeaders["Content-Type"] = "application/json";
    }

    if (auth) {
        Object.assign(requestHeaders, await authHeaders());
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: requestHeaders,
        body: isFormData ? (body as FormData) : JSON.stringify(body),
    });

    // A rejected access token gets one force-refresh + retry before surfacing the error.
    if (response.status === 401 && auth) {
        try {
            await tokenRefreshService.forceRefresh();
            Object.assign(requestHeaders, await authHeaders());

            const retry = await fetch(`${API_BASE_URL}${path}`, {
                method,
                headers: requestHeaders,
                body: isFormData ? (body as FormData) : JSON.stringify(body),
            });

            return handleResponse<T>(retry);
        } catch (error) {
            if (error instanceof SessionExpiredError) {
                throw error;
            }
            throw error;
        }
    }

    return handleResponse<T>(response);
}

export type { ApiRequestOptions };

