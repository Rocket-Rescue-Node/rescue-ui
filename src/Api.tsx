// Basic API client for the Rescue API.
//
// This sends and accepts JSON content.
//
// It uses the VITE_RESCUE_API_BASE_URL to construct requests.

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

// Quota settings for a given operator, based on operator type
// count = total # times per sliding 'window' that access can be requested
// window = sliding 'window' duration measured in seconds
// authValidityWindow = credential validity lifetime measured in seconds
export interface QuotaSettings {
  count: number;
  window: number;
  authValidityWindow: number;
}

// When requesting OperatorInfo, an array of past credential request event
// Unix timestamps and quota settings for the corresponding operator are returned.
// Returns up to the maximum # of allowed credentials from the most recent
// sliding 'window', or returns an empty array if the operator has not
// requested any credentials within that timeframe. Credential events are in
// descending order (newest to oldest). Quota settings are always returned.
export interface OperatorInfo {
  credentialEvents: number[];
  quotaSettings: QuotaSettings;
}

export const Api: {
  createCredentials: ApiMethod<AccessCredential>;
  getOperatorInfo: ApiMethod<OperatorInfo>;
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
  getOperatorInfo: async (params, onData, onError, onComplete) => {
    await rpc<OperatorInfo>(
      "POST",
      "/info",
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
