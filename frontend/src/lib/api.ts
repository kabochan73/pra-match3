const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  readonly status: number;
  readonly errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

function readCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

// Sanctum SPA auth is cookie-based and scoped to the API's own origin, so the
// CSRF cookie must be fetched fresh before every mutating request.
async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, { credentials: "include" });
}

interface ApiFetchOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const method = options.method ?? "GET";

  if (method !== "GET") {
    await ensureCsrfCookie();
  }

  const headers = new Headers({ Accept: "application/json" });
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  const xsrfToken = readCookie("XSRF-TOKEN");
  if (xsrfToken) {
    headers.set("X-XSRF-TOKEN", xsrfToken);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    credentials: "include",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(
      response.status,
      (data?.message as string | undefined) ?? "リクエストに失敗しました",
      data?.errors as Record<string, string[]> | undefined,
    );
  }

  return data as T;
}
