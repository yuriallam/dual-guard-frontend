import { API_BASE_URL } from './config';
import type { ApiError } from '@/types/api/common';

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

// Get stored tokens
const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

// Store tokens
const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

// Clear tokens
const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Refresh access token
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiClientError('No refresh token available', 401);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': navigator.userAgent,
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      throw new ApiClientError('Failed to refresh token', response.status);
    }

    const data = await response.json();
    setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch (error) {
    clearTokens();
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
  if (!skipAuth) {
    const accessToken = getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  // Make request
  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchConfig,
      headers,
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
      const newAccessToken = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      response = await fetch(url, {
        ...fetchConfig,
        headers,
      });
    } catch (refreshError) {
      // Refresh failed, clear tokens and throw
      clearTokens();
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

// Export token management functions
export const tokenManager = {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
};

