import type { HTTPValidationError } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export function parseApiError(status: number, body: unknown): ApiError {
  if (status === 401) {
    return new ApiError(status, "Please sign in to continue.", body);
  }
  if (status === 403) {
    return new ApiError(status, "You do not have access to this resource.", body);
  }
  if (status === 404) {
    return new ApiError(status, "We couldn't find what you were looking for.", body);
  }
  if (status === 422) {
    const validation = body as HTTPValidationError;
    if (Array.isArray(validation?.detail)) {
      const messages = validation.detail.map((d) => d.msg).filter(Boolean);
      return new ApiError(
        status,
        messages.length > 0 ? messages.join(" ") : "Please check your input.",
        body,
      );
    }
    if (typeof validation?.detail === "string") {
      return new ApiError(status, validation.detail, body);
    }
    return new ApiError(status, "Please check your input.", body);
  }
  if (status >= 500) {
    return new ApiError(status, "Something went wrong on our side. Try again shortly.", body);
  }

  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as { detail: unknown }).detail;
    if (typeof detail === "string") {
      return new ApiError(status, detail, body);
    }
  }

  return new ApiError(status, "Request failed. Please try again.", body);
}

export function getApiUrl(): string {
  const url = process.env.API_URL;
  if (!url) {
    throw new Error("API_URL is not configured.");
  }
  return url.replace(/\/$/, "");
}

export function getAppUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export function getAdminUrl(): string {
  return (
    process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001"
  ).replace(/\/$/, "");
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  form?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, token, form, cache, next } = options;
  const headers: HeadersInit = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let payload: BodyInit | undefined;
  if (form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    payload = new URLSearchParams(form).toString();
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    method,
    headers,
    body: payload,
    cache,
    next,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const parsed = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw parseApiError(response.status, parsed);
  }

  return parsed as T;
}

export async function apiRequestBlob(
  path: string,
  options: { token?: string | null; cache?: RequestCache } = {},
): Promise<Blob> {
  const headers: HeadersInit = {};
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    method: "GET",
    headers,
    cache: options.cache,
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") ?? "";
    const parsed = contentType.includes("application/json")
      ? await response.json().catch(() => null)
      : null;
    throw parseApiError(response.status, parsed);
  }

  return response.blob();
}
