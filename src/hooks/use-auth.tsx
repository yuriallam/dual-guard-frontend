import { tokenManager } from '@/api/client';
import {
  clearUserFromStorage,
  loadUserFromStorage,
  saveUserToStorage,
} from '@/api/user-storage';
import { useCurrentUser, useLogin, useLogout } from '@/hooks/api';
import type { LoginPayload } from '@/types/api/auth';
import type { User } from '@/types/entities/user';
import { useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

interface AuthContextType {
  user: User | null;
  isSignedIn: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  // Initialize with cached user data for instant display
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage());
  const [isInitialized, setIsInitialized] = useState(false);

  // React Query hooks
  // Only fetch user if tokens exist
  const hasTokens = tokenManager.hasTokens();
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser,
  } = useCurrentUser();

  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  // Update user state and localStorage when query data changes
  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
      // Save fresh user data to localStorage
      saveUserToStorage(currentUser);
    } else if (userError && !isLoadingUser) {
      // If there's an error and we're not loading, user is not authenticated
      // Clear tokens and cached user data
      tokenManager.clearTokens();
      setUser(null);
      clearUserFromStorage();
    }
  }, [currentUser, userError, isLoadingUser]);

  // Initialize: Check if user has tokens
  // React Query will automatically fetch user data if tokens exist (via useCurrentUser)
  useEffect(() => {
    if (!hasTokens) {
      // No tokens, clear user data
      setUser(null);
      clearUserFromStorage();
    }
    // Mark as initialized - React Query will handle fetching user data
    setIsInitialized(true);
  }, [hasTokens]);

  // Listen for auth signout events (from token refresh failures, etc.)
  useEffect(() => {
    const handleSignOut = () => {
      setUser(null);
      clearUserFromStorage();
      queryClient.clear();
    };

    window.addEventListener('auth:signout', handleSignOut);
    return () => {
      window.removeEventListener('auth:signout', handleSignOut);
    };
  }, [queryClient]);

  // Login function
  const login = useCallback(
    async (payload: LoginPayload) => {
      try {
        await loginMutation.mutateAsync(payload);
        // After successful login, fetch user data
        const userData = await refetchUser();
        if (userData.data) {
          setUser(userData.data);
          // Save to localStorage (already done in useCurrentUser, but ensure it's saved)
          saveUserToStorage(userData.data);
        }
      } catch (error) {
        // Error is handled by the mutation
        throw error;
      }
    },
    [loginMutation, refetchUser],
  );

  // Logout function
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Even if logout fails, clear local state
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      clearUserFromStorage();
      queryClient.clear();
    }
  }, [logoutMutation, queryClient]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const result = await refetchUser();
      if (result.data) {
        setUser(result.data);
        // Save fresh data to localStorage
        saveUserToStorage(result.data);
      }
    } catch (error) {
      // If refresh fails, user might be logged out
      setUser(null);
      clearUserFromStorage();
      throw error;
    }
  }, [refetchUser]);

  // Loading state: true if initializing or loading user
  const isLoading = !isInitialized || isLoadingUser;

  // User is signed in if we have a user object
  const isSignedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
