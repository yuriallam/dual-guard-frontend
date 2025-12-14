# Authentication Implementation Guide

This document explains the complete authentication flow implemented in the DualGuard frontend.

## Overview

The authentication system implements:
1. ✅ Login with email/password
2. ✅ Token storage (supports both cookies and localStorage)
3. ✅ Automatic user data fetching on app load
4. ✅ Protected routes
5. ✅ Automatic token refresh on 401 errors
6. ✅ User context management

## Architecture

### 1. Token Storage (`src/lib/api/token-storage.ts`)

Supports both cookie-based and localStorage-based token storage:
- **Primary**: localStorage (for our implementation)
- **Fallback**: Cookies (if backend sets them)
- Automatically checks cookies first, then falls back to localStorage

### 2. API Client (`src/lib/api/client.ts`)

- **Automatic token refresh**: On 401 errors, automatically refreshes the access token
- **Token interception**: All requests include the access token in the Authorization header
- **Cookie support**: Includes `credentials: 'include'` for cookie-based auth
- **Error handling**: Dispatches `auth:signout` event on refresh failure

### 3. Auth Context (`src/hooks/use-auth.tsx`)

Provides:
- `user`: Current user object (from `/auth/me`)
- `isSignedIn`: Boolean indicating if user is authenticated
- `isLoading`: Loading state during initialization
- `login(payload)`: Login function
- `logout()`: Logout function
- `refreshUser()`: Manually refresh user data

**Initialization Flow**:
1. On mount, checks if tokens exist
2. If tokens exist, fetches user data from `/auth/me`
3. Updates user state based on response
4. Sets `isInitialized` to true

### 4. Protected Routes (`src/components/ProtectedRoute.tsx`)

Wraps routes that require authentication:
- Shows loading state while checking auth
- Redirects to `/signin` if not authenticated
- Preserves the original route for redirect after login

### 5. React Query Hooks (`src/hooks/api/auth.ts`)

- `useCurrentUser()`: Fetches current user (only if tokens exist)
- `useLogin()`: Login mutation
- `useLogout()`: Logout mutation
- All hooks automatically invalidate/update cache

## Flow Diagram

```
User Login
    ↓
POST /auth/login
    ↓
Receive tokens (accessToken, refreshToken)
    ↓
Store tokens (localStorage + cookies)
    ↓
GET /auth/me
    ↓
Save user in context
    ↓
Access protected routes
    ↓
On API call with expired token (401)
    ↓
POST /auth/refresh
    ↓
Update tokens
    ↓
Retry original request
```

## Usage Examples

### Login

```typescript
import { useAuth } from '@/hooks/use-auth';

const { login, isLoading } = useAuth();

await login({
  email: 'user@example.com',
  password: 'password123'
});
```

### Access User Data

```typescript
import { useAuth } from '@/hooks/use-auth';

const { user, isSignedIn, isLoading } = useAuth();

if (isLoading) return <div>Loading...</div>;
if (!isSignedIn) return <div>Please sign in</div>;

return <div>Welcome, {user?.username}!</div>;
```

### Protected Routes

```typescript
import { ProtectedRoute } from '@/components/ProtectedRoute';

<Route
  path="/account"
  element={
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  }
/>
```

### Logout

```typescript
import { useAuth } from '@/hooks/use-auth';

const { logout } = useAuth();

await logout();
```

## Token Refresh Interception

The API client automatically handles token refresh:

1. **Request made** with access token
2. **401 response** received
3. **Refresh token** used to get new access token
4. **Original request** retried with new token
5. **If refresh fails**: Tokens cleared, user logged out, `auth:signout` event dispatched

This happens transparently - no manual intervention needed!

## Security Features

1. **Token Storage**: Secure storage in localStorage with cookie fallback
2. **Automatic Cleanup**: Tokens cleared on logout or refresh failure
3. **Protected Routes**: Routes automatically protected with redirect
4. **Error Handling**: Proper error messages and fallbacks
5. **Token Refresh**: Automatic token refresh prevents session expiration

## Environment Variables

Set `VITE_API_BASE_URL` in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Testing the Flow

1. **Login**: Go to `/signin`, enter credentials
2. **Redirect**: After login, redirects to original page or home
3. **Protected Route**: Try accessing `/account` - should work if logged in
4. **Logout**: Call `logout()` - clears tokens and redirects
5. **Token Refresh**: Wait for token to expire, make API call - should auto-refresh

## Troubleshooting

### User not loading after login
- Check browser console for errors
- Verify tokens are stored: `localStorage.getItem('accessToken')`
- Check network tab for `/auth/me` request

### Token refresh not working
- Verify refresh token exists: `localStorage.getItem('refreshToken')`
- Check network tab for `/auth/refresh` request
- Ensure backend is returning new tokens

### Protected routes redirecting incorrectly
- Verify `ProtectedRoute` wraps the route
- Check `isLoading` state in auth context
- Ensure tokens exist before accessing protected routes

