// API configuration

// Get API base URL from environment variable or use default
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    SIGN_UP: '/auth/signup',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
    REFRESH_TOKEN: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    ME: '/auth/me',
  },
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
  },
  // Contests
  CONTESTS: {
    BASE: '/contests',
    BY_ID: (id: number) => `/contests/${id}`,
    JOIN: (id: number) => `/contests/${id}/join`,
    LEAVE: (id: number) => `/contests/${id}/leave`,
    PARTICIPANTS: (id: number) => `/contests/${id}/participants`,
  },
  // Issues
  ISSUES: {
    BASE: '/issues',
    BY_ID: (id: number) => `/issues/${id}`,
    BY_CONTEST: (contestId: number) => `/contests/${contestId}/issues`,
    COMMENTS: (id: number) => `/issues/${id}/comments`,
    ESCALATION: (id: number) => `/issues/${id}/escalation`,
  },
} as const;

