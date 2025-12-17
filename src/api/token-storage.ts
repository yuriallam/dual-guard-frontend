// Token storage utilities
// Uses cookies only - tokens are managed by the backend via httpOnly cookies
// We only check for cookie existence, not their values (since they're httpOnly)

// Cookie utilities
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

const setCookie = (name: string, value: string, days: number = 7): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Token storage - cookies only (no localStorage)
// Note: If backend uses httpOnly cookies, we can't read their values
// We only check for their existence or rely on backend to set them
export const tokenStorage = {
  // Get access token from cookie
  // Returns the actual token value if available, or null
  getAccessToken: (): string | null => {
    // Try common cookie names
    return (
      getCookie('accessToken') ||
      getCookie('access_token') ||
      getCookie('token') ||
      null
    );
  },

  // Get refresh token from cookie
  // Returns the actual token value if available, or null
  getRefreshToken: (): string | null => {
    // Try common cookie names
    return (
      getCookie('refreshToken') ||
      getCookie('refresh_token') ||
      null
    );
  },

  // Store tokens in cookies
  // If backend sets httpOnly cookies via Set-Cookie header, those take precedence
  // Otherwise, we store tokens in cookies so they're sent with every request
  setTokens: (accessToken: string, refreshToken: string): void => {
    // Store tokens in cookies so they're automatically sent with requests
    // Using SameSite=Lax for security (prevents CSRF while allowing normal usage)
    setCookie('accessToken', accessToken, 7); // 7 days
    setCookie('refreshToken', refreshToken, 30); // 30 days for refresh token
    // Also set common cookie names for compatibility
    setCookie('access_token', accessToken, 7);
    setCookie('refresh_token', refreshToken, 30);
  },

  // Clear tokens - delete cookies
  clearTokens: (): void => {
    // Delete cookies (backend should also clear them on logout)
    deleteCookie('accessToken');
    deleteCookie('refreshToken');
    // Also try common cookie names
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    deleteCookie('token');
  },

  // Check if user has tokens (checks if cookies exist)
  hasTokens: (): boolean => {
    // Check if either token cookie exists
    return (
      getCookie('accessToken') !== null ||
      getCookie('refreshToken') !== null ||
      getCookie('access_token') !== null ||
      getCookie('refresh_token') !== null ||
      getCookie('token') !== null
    );
  },
};

