import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { tokenManager } from '@/lib/api/client';
import { queryKeys } from './query-keys';
import type {
  LoginPayload,
  SignUpPayload,
  VerifyEmailPayload,
  ResendVerificationEmailPayload,
} from '@/types/api/auth';
import type { User } from '@/types/entities/user';

// Get current authenticated user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authApi.getCurrentUser(),
    enabled: tokenManager.hasTokens(), // Only fetch if tokens exist
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: () => {
      // Invalidate and refetch user data after login
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
};

// Sign up mutation
export const useSignUp = () => {
  return useMutation({
    mutationFn: (payload: SignUpPayload) => authApi.signUp(payload),
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
      // Remove user data
      queryClient.removeQueries({ queryKey: queryKeys.auth.me() });
    },
  });
};

// Logout from all devices mutation
export const useLogoutAll = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logoutAll(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
      // Remove user data
      queryClient.removeQueries({ queryKey: queryKeys.auth.me() });
    },
  });
};

// Verify email mutation
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: VerifyEmailPayload) => authApi.verifyEmail(payload),
    onSuccess: () => {
      // Refetch user data after email verification
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
};

// Resend verification email mutation
export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: (payload: ResendVerificationEmailPayload) =>
      authApi.resendVerificationEmail(payload),
  });
};

