import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { queryKeys } from './query-keys';
import type { UpdateUserPayload } from '@/types/entities/user';
import type { QueryParams, PaginatedResponse } from '@/types/api/common';
import type { User } from '@/types/entities/user';

// Get all users with pagination
export const useUsers = (params?: QueryParams) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => usersApi.getAll(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get users with infinite scroll
export const useInfiniteUsers = (params?: Omit<QueryParams, 'page' | 'offset'>) => {
  return useInfiniteQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: ({ pageParam = 1 }) =>
      usersApi.getAll({ ...params, page: pageParam }),
    getNextPageParam: (lastPage: PaginatedResponse<User>) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get user by ID
export const useUser = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get current user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: queryKeys.users.profile(),
    queryFn: () => usersApi.getProfile(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Update user profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => usersApi.updateProfile(payload),
    onSuccess: (data) => {
      // Update the profile query
      queryClient.setQueryData(queryKeys.users.profile(), data);
      // Invalidate user detail queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users.details() });
      // Also update auth me query if it exists
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
  });
};

