import { api } from './client';
import { API_ENDPOINTS } from './config';
import type {
  LoginPayload,
  SignUpPayload,
  TokenResponse,
  SignUpResponse,
  RefreshTokenPayload,
  VerifyEmailPayload,
  VerifyEmailResponse,
  ResendVerificationEmailPayload,
  ResendVerificationEmailResponse,
  LogoutResponse,
} from '@/types/api/auth';
import type { User } from '@/types/entities/user';
import { tokenManager } from './client';

// Auth API client
export const authApi = {
  // Login (sign in)
  login: async (payload: LoginPayload): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      payload,
      {
        skipAuth: true,
        headers: {
          'User-Agent': navigator.userAgent,
        },
      },
    );
    // Tokens are set by backend via httpOnly cookies (Set-Cookie header)
    // No need to store them manually - browser handles it automatically
    // tokenManager.setTokens is a no-op when using cookie-based auth
    return response;
  },

  // Sign up
  signUp: async (payload: SignUpPayload): Promise<SignUpResponse> => {
    return api.post<SignUpResponse>(
      API_ENDPOINTS.AUTH.SIGN_UP,
      payload,
      { skipAuth: true },
    );
  },

  // Logout (sign out)
  logout: async (): Promise<void> => {
    try {
      await api.post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Even if the request fails, clear local tokens
      console.error('Logout error:', error);
    } finally {
      tokenManager.clearTokens();
      // Dispatch event for auth state change
      window.dispatchEvent(new CustomEvent('auth:signout'));
    }
  },

  // Logout from all devices
  logoutAll: async (): Promise<void> => {
    try {
      await api.post<LogoutResponse>(API_ENDPOINTS.AUTH.LOGOUT_ALL);
    } catch (error) {
      // Even if the request fails, clear local tokens
      console.error('Logout all error:', error);
    } finally {
      tokenManager.clearTokens();
      // Dispatch event for auth state change
      window.dispatchEvent(new CustomEvent('auth:signout'));
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return api.get<User>(API_ENDPOINTS.AUTH.ME);
  },

  // Refresh token
  refreshToken: async (
    payload: RefreshTokenPayload,
  ): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      payload,
      {
        skipAuth: true,
        headers: {
          'User-Agent': navigator.userAgent,
        },
      },
    );
    // Tokens are set by backend via httpOnly cookies (Set-Cookie header)
    // No need to store them manually - browser handles it automatically
    return response;
  },

  // Verify email
  verifyEmail: async (
    payload: VerifyEmailPayload,
  ): Promise<VerifyEmailResponse> => {
    return api.post<VerifyEmailResponse>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      payload,
      { skipAuth: true },
    );
  },

  // Resend verification email
  resendVerificationEmail: async (
    payload: ResendVerificationEmailPayload,
  ): Promise<ResendVerificationEmailResponse> => {
    return api.post<ResendVerificationEmailResponse>(
      API_ENDPOINTS.AUTH.RESEND_VERIFICATION,
      payload,
      { skipAuth: true },
    );
  },
};

