// Basic API client for the Rescue API.
//
// This sends and accepts JSON content.
//
// It uses the VITE_RESCUE_API_BASE_URL to construct requests.

// TODO: consider useApi wrapper for hook usage

/// The base URL for all API calls, e.g.
const baseUrl = import.meta.env?.VITE_RESCUE_API_BASE_URL;

/// The parameters for an API request.
interface ApiRequestParameters {
  query: Record<string, string>;
  body: string;
}

// Define a generic type for API methods
type ApiMethod<T> = (params: ApiRequestParameters) => Promise<T>;

// Generic esponse from the API
interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Types that appear in API payloads:
export interface AccessCredential {
  username: string;
  password: string;
  timestamp: number;
  expiresAt: number;
}

export const Api: {
  createCredentials: ApiMethod<ApiResponse<AccessCredential>>;
  // TODO: other methods
} = {
  createCredentials: async (params) =>
    await rpc("POST", "/credentials", params),
  // TODO: other methods
};

/// Perform the low-level API request.
async function rpc(
  method: "POST" | "GET",
  path: string,
  params: ApiRequestParameters,
) {
  const url = new URL(baseUrl + path);
  Object.keys(params.query ?? {}).forEach((key) => {
    url.searchParams.set(key, params.query ? params.query[key] : "");
  });
  let body = params.body;
  if (body && typeof body !== "string") {
    body = JSON.stringify(body);
  }
  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      // TODO: consider using auth
      //  Authorization: `Bearer ${authToken}`,
    },
    body,
  });
  if (!response.ok) {
    let errorRes;
    try {
      errorRes = await response.json();
    } catch (err) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    throw errorRes?.error || errorRes;
  }
  return await response.json();
}
