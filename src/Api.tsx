// Basic API client for the Rescue API.
// This sends and accepts JSON content.

//
// It uses the VITE_RESCUE_API_BASE_URL to construct requests.

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
const baseUrl = import.meta.env.VITE_RESCUE_API_BASE_URL;

/// The parameters for an API request.
interface ApiRequestParameters {
  query: Record<string, string>;
  body: string;
}

// Define a generic type for API methods
type ApiMethod<T> = (
  params: ApiRequestParameters,
  onData: (data: T) => void,
  onError: (error: string) => void,
  onComplete: () => void,
) => Promise<void>;

// Generic response from the API
interface ApiResponse<T> {
  data?: T;
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
  createCredentials: ApiMethod<AccessCredential>;
  // Other methods
} = {
  createCredentials: async (params, onData, onError, onComplete) => {
    await rpc<AccessCredential>(
      "POST",
      "/credentials",
      params,
      onData,
      onError,
      onComplete,
    );
  },
  // Other methods
};

/// Perform the low-level API request.
async function rpc<T>(
  method: "POST" | "GET",
  path: string,
  params: ApiRequestParameters,
  onData: (data: T) => void,
  onError: (error: string) => void,
  onComplete: () => void,
): Promise<void> {
  let url: URL;
  try {
    url = new URL(`${baseUrl}${path}`);
  } catch (err) {
    onError(`API request failed: ${err as string}`);
    onComplete();
    return;
  }

  Object.keys(params.query ?? {}).forEach((key) => {
    url.searchParams.set(key, params.query ? params.query[key] : "");
  });

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // TODO: consider using auth
        //  Authorization: `Bearer ${authToken}`,
      },
      body: params.body,
    });
  } catch (err) {
    onError(`API request failed: ${err as string}`);
    onComplete();
    return;
  }

  if (!response.ok) {
    let errorRes: { error?: string } | string;
    try {
      errorRes = await response.json();
    } catch (err) {
      onError(`API request failed: ${response.statusText}`);
      onComplete();
      return;
    }
    if (typeof errorRes === "string") {
      onError(errorRes);
    } else if (typeof errorRes.error === "string") {
      onError(errorRes.error);
    } else {
      onError("Unknown error occurred");
    }
    onComplete();
    return;
  }

  const responseJson: ApiResponse<T> = await response.json();
  if (responseJson.error) {
    onError(responseJson.error);
  } else if (!responseJson.data) {
    console.log("missing .data and .error", responseJson);
    onError("invalid response (missing .data and .error)");
  } else {
    onData(responseJson.data);
  }
  onComplete();
}
