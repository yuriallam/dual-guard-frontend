import { authApi } from "@/api";
import { tokenManager } from "@/api/client";
import { loadUserFromStorage, saveUserToStorage } from "@/api/user-storage";
import { queryKeys } from "@/constants/queryKeys";
import type {
  LoginPayload,
  ResendVerificationEmailPayload,
  SignUpPayload,
  VerifyEmailPayload,
} from "@/types/api/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get current authenticated user
// Uses cached data from localStorage for instant display, but always fetches fresh data
export const useCurrentUser = () => {
  // Load cached user data for initial display
  const cachedUser = loadUserFromStorage();

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const user = await authApi.getCurrentUser();
      // Save fresh user data to localStorage
      saveUserToStorage(user);
      return user;
    },
    enabled: tokenManager.hasTokens(), // Only fetch if tokens exist
    retry: false,
    staleTime: 0, // Always consider data stale to fetch fresh data
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    // Use cached data as initial data for instant display
    initialData: cachedUser || undefined,
    // Refetch on mount to get fresh data
    refetchOnMount: true,
    // Refetch on window focus to keep data fresh
    refetchOnWindowFocus: true,
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
