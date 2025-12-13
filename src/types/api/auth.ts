// Auth API types

// Sign in (login) payload
export interface LoginPayload {
  email: string;
  password: string;
}

// Sign up payload
export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
}

// Token response (for login and refresh)
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Sign up response
export interface SignUpResponse {
  success: true;
  message: string;
}

// Refresh token payload
export interface RefreshTokenPayload {
  refreshToken: string;
}

// Email verification payload
export interface VerifyEmailPayload {
  token: string;
}

// Email verification response
export interface VerifyEmailResponse {
  success: true;
  message: string;
}

// Resend verification email payload
export interface ResendVerificationEmailPayload {
  email: string;
}

// Resend verification email response
export interface ResendVerificationEmailResponse {
  success: true;
  message: string;
}

// Logout response
export interface LogoutResponse {
  success: true;
}

