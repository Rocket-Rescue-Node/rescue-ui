// Basic API client for the Rescue API.
// This sends and accepts JSON content.

import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  QueryKey,
} from "@tanstack/react-query";

// It uses the VITE_RESCUE_API_BASE_URL to construct requests.
const api = {
  createCredentials: {
    method: (params: ApiRequestParameters) =>
      rpc("POST", "/credentials", params),
    type: "mutation",
  },
  getOperatorInfo: {
    method: (params: ApiRequestParameters) => rpc("POST", "/info", params),
    type: "query",
  },
  // TODO: add other API methods here
  // myNewMethod: {
  //   method: (params: ApiRequestParameters) => rpc("POST", "/path/to/method", params),
  //   type: "query" | "mutation"
  // }
} as const;

// Restricts useApi to known api names and defines appropriate hook types
// Consider updating api calls to specify return type for replacing <any> in Use*Result
type UseApi = {
  [k in keyof typeof api]: (typeof api)[k]["type"] extends "query"
    ? (
        params: ApiRequestParameters,
        options?: CustomUseQueryOptions,
      ) => UseQueryResult<any, Error>
    : (typeof api)[k]["type"] extends "mutation"
      ? (
          params: ApiRequestParameters,
          options?: CustomUseMutationOptions,
        ) => UseMutationResult<any, Error, ApiRequestParameters, unknown>
      : never;
};

// In useQuery(): prevent queryFn being overridden, make queryKey optional
type CustomUseQueryOptions = Omit<UseQueryOptions, "queryFn" | "queryKey"> & {
  queryKey?: QueryKey;
};

// In useMutation(): prevent mutationFn being overridden
type CustomUseMutationOptions = Omit<UseMutationOptions, "mutationFn">;

// Generate hooks based on api
export const useApi = Object.fromEntries(
  Object.entries(api)
    .map(([key, apiCall]) => {
      // Generate query hooks
      if (apiCall.type === "query") {
        return [
          key,
          (params: ApiRequestParameters, options?: CustomUseQueryOptions) => {
            return useQuery({
              ...options,
              queryKey: options?.queryKey ?? [key, params.body, params.query],
              queryFn: () => {
                return apiCall.method(params);
              },
            });
          },
        ];
      }

      // Generate mutation hooks
      if (apiCall.type === "mutation") {
        return [
          key,
          (
            params: ApiRequestParameters,
            options?: CustomUseMutationOptions,
          ) => {
            return useMutation({
              ...options,
              mutationKey: options?.mutationKey ?? [
                key,
                params.body,
                params.query,
              ],
              mutationFn: () => {
                return apiCall.method(params);
              },
            });
          },
        ];
      }

      // Type set incorrectly - filtered out below
      return [];
    })
    .filter((entry) => entry.length > 0),
) as UseApi;

/// The base URL for all API calls, e.g.
const baseUrl = import.meta.env?.VITE_RESCUE_API_BASE_URL;

/// Perform the low-level API request.
export async function rpc(
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

// Interface for parameters in an API request
export interface ApiRequestParameters {
  query?: Record<string, string>;
  body?: any;
  options?: any;
}

// Interface for parameters in a createCredential response
export interface AccessCredential {
  username: string;
  password: string;
  timestamp: number;
  expiresAt: number;
}
