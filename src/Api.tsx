// Basic API client for the Rescue API.
//
// This sends and accepts JSON content.
//
// It uses the VITE_RESCUE_API_BASE_URL to construct requests.
export const Api: {
  [method: string]: (params: ApiRequestParameters) => Promise<any>;
} = {
  createCredentials: (params) => rpc("POST", "/credentials", params),

  // TODO: add other API methods here
  // myNewMethod: (params) => rpc("POST", "/path/to/method", params),
};

/// The base URL for all API calls, e.g.
const baseUrl = import.meta.env?.VITE_RESCUE_API_BASE_URL;

/// The parameters for an API request.
type ApiRequestParameters = {
  query?: {
    [key: string]: string;
  };
  body?: any;
  options?: any;
};

/// Perform the low-level API request.
async function rpc(
  method: "POST" | "GET",
  path: string,
  params: ApiRequestParameters,
) {
  let url = new URL(baseUrl + path);
  Object.keys(params.query || {}).forEach((key) => {
    url.searchParams.set(key, params.query![key]);
  });
  let body = params.body;
  if (body && typeof body !== "string") {
    body = JSON.stringify(body);
  }
  let response = await fetch(url, {
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
  return response.json();
}

// TODO: consider useApi wrapper for hook usage

// Types that appear in API payloads:

export type AccessCredential = {
  username: string;
  password: string;
  timestamp: number;
  expiresAt: number;
};
