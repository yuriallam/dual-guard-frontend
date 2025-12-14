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

const deleteCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Token storage - cookies only (no localStorage)
// Note: If backend uses httpOnly cookies, we can't read their values
// We only check for their existence or rely on backend to set them
export const tokenStorage = {
  // Check if access token cookie exists
  // Note: If using httpOnly cookies, we can't read the value
  // This just checks if the cookie is present
  getAccessToken: (): string | null => {
    // For httpOnly cookies, we can't read the value
    // Return a flag indicating cookie exists, or null
    // The actual token will be sent automatically by the browser
    const cookieExists = getCookie('accessToken') !== null;
    return cookieExists ? 'cookie' : null; // Return a flag, not the actual token
  },

  // Check if refresh token cookie exists
  getRefreshToken: (): string | null => {
    // For httpOnly cookies, we can't read the value
    // Return a flag indicating cookie exists, or null
    const cookieExists = getCookie('refreshToken') !== null;
    return cookieExists ? 'cookie' : null; // Return a flag, not the actual token
  },

  // Store tokens - NOT USED when backend sets httpOnly cookies
  // Tokens are set by backend via Set-Cookie header
  // This is kept for compatibility but does nothing
  setTokens: (_accessToken: string, _refreshToken: string): void => {
    // Do nothing - tokens are managed by backend via cookies
    // Backend sets cookies via Set-Cookie header in response
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

