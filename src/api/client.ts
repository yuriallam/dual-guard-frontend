import { API_BASE_URL } from './config';
import type { ApiError } from '@/types/api/common';
import { tokenStorage } from './token-storage';

// Custom error class for API errors
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// Request configuration
interface RequestConfig extends RequestInit {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

// Token management (re-exported for convenience)
export const tokenManager = {
  getAccessToken: tokenStorage.getAccessToken,
  getRefreshToken: tokenStorage.getRefreshToken,
  setTokens: tokenStorage.setTokens,
  clearTokens: tokenStorage.clearTokens,
  hasTokens: tokenStorage.hasTokens,
};

// Refresh access token
// Uses refresh token from cookie and sends it in the request body
// Returns the new tokens or throws an error
const refreshAccessToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  // Get refresh token from cookie
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new ApiClientError('No refresh token available', 401);
  }

  try {
    // Send refresh token in body (as per API spec) and also via cookie
    // Backend can read from either location
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': navigator.userAgent,
      },
      body: JSON.stringify({ refreshToken }),
      credentials: 'include', // Essential: Include cookies for cookie-based auth
    });

    if (!response.ok) {
      tokenStorage.clearTokens();
      throw new ApiClientError('Failed to refresh token', response.status);
    }

    // Parse response to get new tokens
    let tokenData: { accessToken: string; refreshToken: string };
    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        tokenData = await response.json();
      } else {
        const text = await response.text();
        tokenData = text ? JSON.parse(text) : {};
      }
    } catch (error) {
      throw new ApiClientError('Failed to parse refresh token response', response.status);
    }

    // Store new tokens in cookies
    if (tokenData.accessToken && tokenData.refreshToken) {
      tokenStorage.setTokens(tokenData.accessToken, tokenData.refreshToken);
    } else {
      // If backend sets tokens via Set-Cookie headers, they're already stored
      // But we should still have them in the response body
      throw new ApiClientError('No tokens in refresh response', response.status);
    }

    return tokenData;
  } catch (error) {
    tokenStorage.clearTokens();
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError('Failed to refresh token', 500);
  }
};

// Main API client function
export const apiClient = async <T>(
  endpoint: string,
  config: RequestConfig = {},
): Promise<T> => {
  const { skipAuth = false, skipErrorHandling = false, ...fetchConfig } = config;

  // Build full URL
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchConfig.headers,
  };

  // For protected API calls, tokens are sent via cookies
  // Cookies are automatically included with credentials: 'include'
  // The backend reads the token from the cookie (accessToken or access_token)
  // No need to manually add Authorization header - cookies handle authentication
  if (!skipAuth) {
    // Tokens are stored in cookies and sent automatically
    // Backend will read accessToken or access_token cookie
  }

  // Make request
  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchConfig,
      headers,
      credentials: 'include', // Include cookies if backend sets them
    });
  } catch (error) {
    throw new ApiClientError(
      error instanceof Error ? error.message : 'Network error',
      0,
    );
  }

  // Handle 401 - try to refresh token and retry
  if (response.status === 401 && !skipAuth && !skipErrorHandling) {
    try {
      // Refresh token - get new access and refresh tokens
      await refreshAccessToken();
      
      // Retry the original request with new tokens (now in cookies)
      // The new access token cookie will be sent automatically
      // Preserve all original request config (method, body, headers, etc.)
      const retryResponse = await fetch(url, {
        ...fetchConfig,
        headers,
        credentials: 'include', // Essential: Include cookies with new tokens
      });

      // If retry still returns 401, authentication failed
      if (retryResponse.status === 401) {
        tokenStorage.clearTokens();
        window.dispatchEvent(new CustomEvent('auth:signout'));
        throw new ApiClientError('Authentication failed after token refresh', 401);
      }

      // Use the retry response for further processing
      response = retryResponse;
    } catch (refreshError) {
      // Refresh failed, clear cookies and throw
      tokenStorage.clearTokens();
      // Dispatch event for auth state change
      window.dispatchEvent(new CustomEvent('auth:signout'));
      
      // Re-throw if it's already an ApiClientError, otherwise wrap it
      if (refreshError instanceof ApiClientError) {
        throw refreshError;
      }
      throw new ApiClientError('Authentication failed', 401);
    }
  }

  // Parse response (after potential retry)
  let data: T | ApiError;
  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? (JSON.parse(text) as T) : ({} as T);
    }
  } catch (error) {
    throw new ApiClientError('Failed to parse response', response.status);
  }

  // Handle error responses
  if (!response.ok) {
    const error = data as ApiError;
    const apiError = new ApiClientError(
      error.message || `Request failed with status ${response.status}`,
      response.status,
      error.code,
      error.details,
    );

    if (!skipErrorHandling) {
      // Dispatch error event for global error handling
      window.dispatchEvent(
        new CustomEvent('api:error', { detail: apiError }),
      );
    }

    throw apiError;
  }

  return data as T;
};

// Convenience methods
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    apiClient<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    apiClient<T>(endpoint, { ...config, method: 'DELETE' }),
};

// Token manager is already exported above

