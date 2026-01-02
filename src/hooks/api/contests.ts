import { contestsApi } from "@/api";
import { queryKeys } from "@/constants/queryKeys";
import type { PaginatedResponse, QueryParams } from "@/types/api/common";
import type {
  Contest,
  ContestWithRelations,
  CreateContestPayload,
  UpdateContestPayload,
} from "@/types/entities/contest";
import type { UserParticipationResponse } from "@/types/api/contest-participation";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Get all contests with pagination
export const useContests = (params?: QueryParams) => {
  return useQuery({
    queryKey: queryKeys.contests.list(params),
    queryFn: () => contestsApi.getAll(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get contests with infinite scroll
export const useInfiniteContests = (
  params?: Omit<QueryParams, "page" | "offset">
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.contests.list(params),
    queryFn: ({ pageParam = 1 }) =>
      contestsApi.getAll({ ...params, page: pageParam }),
    getNextPageParam: (
      lastPage: PaginatedResponse<Contest | ContestWithRelations>
    ) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get contest by ID
export const useContest = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.contests.detail(id),
    queryFn: () => contestsApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create contest mutation
export const useCreateContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContestPayload) => contestsApi.create(payload),
    onSuccess: () => {
      // Invalidate contests list
      queryClient.invalidateQueries({ queryKey: queryKeys.contests.lists() });
    },
  });
};

// Update contest mutation
export const useUpdateContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateContestPayload;
    }) => contestsApi.update(id, payload),
    onSuccess: (data, variables) => {
      // Update the specific contest query
      queryClient.setQueryData(queryKeys.contests.detail(variables.id), data);
      // Invalidate contests list
      queryClient.invalidateQueries({ queryKey: queryKeys.contests.lists() });
    },
  });
};

// Delete contest mutation
export const useDeleteContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contestsApi.delete(id),
    onSuccess: (_, id) => {
      // Remove the specific contest query
      queryClient.removeQueries({ queryKey: queryKeys.contests.detail(id) });
      // Invalidate contests list
      queryClient.invalidateQueries({ queryKey: queryKeys.contests.lists() });
    },
  });
};

// Join contest mutation
export const useJoinContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contestsApi.join(id),
    onSuccess: (_, contestId) => {
      // Invalidate contest detail to get updated participant count
      queryClient.invalidateQueries({
        queryKey: queryKeys.contests.detail(contestId),
      });
      // Invalidate participants list
      queryClient.invalidateQueries({
        queryKey: queryKeys.contests.participants(contestId),
      });
    },
  });
};

// Leave contest mutation
export const useLeaveContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contestsApi.leave(id),
    onSuccess: (_, contestId) => {
      // Invalidate contest detail to get updated participant count
      queryClient.invalidateQueries({
        queryKey: queryKeys.contests.detail(contestId),
      });
      // Invalidate participants list
      queryClient.invalidateQueries({
        queryKey: queryKeys.contests.participants(contestId),
      });
    },
  });
};

// Get contest participants
export const useContestParticipants = (
  contestId: number,
  params?: QueryParams
) => {
  return useQuery({
    queryKey: [...queryKeys.contests.participants(contestId), params],
    queryFn: () => contestsApi.getParticipants(contestId, params),
    enabled: !!contestId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get active and upcoming contests
export const useActiveAndUpcomingContests = () => {
  return useQuery({
    queryKey: queryKeys.contests.activeUpcoming(),
    queryFn: () => contestsApi.getActiveAndUpcoming(),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get paginated contests
export const usePaginatedContests = (params?: QueryParams) => {
  return useQuery({
    queryKey: [...queryKeys.contests.list(params), 'paginated'],
    queryFn: () => contestsApi.getPaginated(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get user participation in contest
export const useContestParticipation = (contestId: number, enabled = true) => {
  return useQuery({
    queryKey: [...queryKeys.contests.detail(contestId), 'participation'],
    queryFn: () => contestsApi.getMyParticipation(contestId),
    enabled: enabled && !!contestId,
    staleTime: 30 * 1000, // 30 seconds
  });
};
