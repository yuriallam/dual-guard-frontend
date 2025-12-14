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
// When using cookie-based auth, refresh token is in httpOnly cookie
// Backend will automatically use it when we call the refresh endpoint
const refreshAccessToken = async (): Promise<string> => {
  // Check if refresh token cookie exists
  if (!tokenStorage.hasTokens()) {
    throw new ApiClientError('No refresh token available', 401);
  }

  try {
    // For cookie-based auth, refresh token is in httpOnly cookie
    // Backend reads it from the cookie automatically
    // We don't need to send it in the body (but some backends might expect it)
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': navigator.userAgent,
      },
      // Don't send refreshToken in body - backend reads it from httpOnly cookie
      body: JSON.stringify({}),
      credentials: 'include', // Essential: Include cookies for cookie-based auth
    });

    if (!response.ok) {
      tokenStorage.clearTokens();
      throw new ApiClientError('Failed to refresh token', response.status);
    }

    // Backend sets new tokens via Set-Cookie header in response
    // Browser automatically stores them - we don't need to do anything
    // Return a flag indicating success (actual token is in httpOnly cookie)
    return 'refreshed';
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

  // Add auth token if not skipped
  // Note: With cookie-based auth, tokens are sent automatically by the browser
  // via httpOnly cookies when credentials: 'include' is set
  // We don't need to manually add Authorization header for cookie-based auth
  // The backend reads the token from the cookie automatically
  if (!skipAuth) {
    // For cookie-based auth, tokens are sent automatically via cookies
    // No need to manually add Authorization header
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
      // Refresh token - backend reads refresh token from httpOnly cookie
      // Backend sets new access token via Set-Cookie header
      await refreshAccessToken();
      // Retry the original request - new access token is in httpOnly cookie
      // Browser automatically sends it with credentials: 'include'
      // No need to manually set Authorization header
      response = await fetch(url, {
        ...fetchConfig,
        headers,
        credentials: 'include', // Essential: Include cookies
      });
    } catch (refreshError) {
      // Refresh failed, clear cookies and throw
      tokenStorage.clearTokens();
      // Dispatch event for auth state change
      window.dispatchEvent(new CustomEvent('auth:signout'));
      throw new ApiClientError('Authentication failed', 401);
    }
  }

  // Parse response
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

