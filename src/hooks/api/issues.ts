import { issuesApi } from "@/api";
import { queryKeys } from "@/constants/queryKeys";
import type { PaginatedResponse, QueryParams } from "@/types/api/common";
import type {
  CreateIssueCommentPayload,
  CreateIssueEscalationCommentPayload,
  CreateIssuePayload,
  Issue,
  IssueWithRelations,
  UpdateIssueByAuditorPayload,
  UpdateIssueEscalationCommentPayload,
  UpdateIssuePayload,
} from "@/types/entities/issue";
import type { UserParticipationResponse } from "@/types/api/contest-participation";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// Get all issues with pagination
export const useIssues = (params?: QueryParams) => {
  return useQuery({
    queryKey: queryKeys.issues.list(params),
    queryFn: () => issuesApi.getAll(params),
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get issues with infinite scroll
export const useInfiniteIssues = (
  params?: Omit<QueryParams, "page" | "offset">
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.issues.list(params),
    queryFn: ({ pageParam = 1 }) =>
      issuesApi.getAll({ ...params, page: pageParam }),
    getNextPageParam: (
      lastPage: PaginatedResponse<Issue | IssueWithRelations>
    ) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get issues by contest ID
export const useContestIssues = (
  contestId: number,
  params?: QueryParams,
  enabled = true
) => {
  return useQuery({
    queryKey: queryKeys.issues.byContest(contestId, params),
    queryFn: () => issuesApi.getByContest(contestId, params),
    enabled: enabled && !!contestId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get issues by contest with infinite scroll
export const useInfiniteContestIssues = (
  contestId: number,
  params?: Omit<QueryParams, "page" | "offset">
) => {
  return useInfiniteQuery({
    queryKey: queryKeys.issues.byContest(contestId, params),
    queryFn: ({ pageParam = 1 }) =>
      issuesApi.getByContest(contestId, { ...params, page: pageParam }),
    getNextPageParam: (
      lastPage: PaginatedResponse<Issue | IssueWithRelations>
    ) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!contestId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Get issue by ID
export const useIssue = (id: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.issues.detail(id),
    queryFn: () => issuesApi.getById(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create issue mutation
export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateIssuePayload) => issuesApi.create(payload),
    onSuccess: (data) => {
      // Invalidate issues list
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.lists() });
      // Invalidate contest issues
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.byContest(data.contestId),
      });
      // Invalidate contest detail to update issue count
      queryClient.invalidateQueries({
        queryKey: queryKeys.contests.detail(data.contestId),
      });
      // Invalidate participation to update user's submitted issues
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.contests.detail(data.contestId), 'participation'],
      });
    },
  });
};

// Update issue mutation
export const useUpdateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateIssuePayload;
    }) => issuesApi.update(id, payload),
    onSuccess: (data, variables) => {
      // Update the specific issue query
      queryClient.setQueryData(queryKeys.issues.detail(variables.id), data);
      // Invalidate issues list
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.lists() });
      // Invalidate contest issues
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.byContest(data.contestId),
      });
    },
  });
};

// Delete issue mutation
export const useDeleteIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => issuesApi.delete(id),
    onSuccess: async (_, id) => {
      // Get the issue to know which contest it belonged to
      const issue = queryClient.getQueryData<IssueWithRelations>(
        queryKeys.issues.detail(id)
      );

      // Remove the specific issue query
      queryClient.removeQueries({ queryKey: queryKeys.issues.detail(id) });
      // Invalidate issues list
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.lists() });

      // If we know the contest, invalidate its issues
      if (issue?.contestId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.issues.byContest(issue.contestId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.contests.detail(issue.contestId),
        });
      }
    },
  });
};

// Get issue comments
export const useIssueComments = (
  issueId: number,
  params?: QueryParams,
  enabled = true
) => {
  return useQuery({
    queryKey: [...queryKeys.issues.comments(issueId), params],
    queryFn: () => issuesApi.getComments(issueId, params),
    enabled: enabled && !!issueId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Create issue comment mutation
export const useCreateIssueComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      issueId,
      payload,
    }: {
      issueId: number;
      payload: CreateIssueCommentPayload;
    }) => issuesApi.createComment(issueId, payload),
    onSuccess: (_, variables) => {
      // Invalidate comments list
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.comments(variables.issueId),
      });
      // Invalidate issue detail to get updated comment count
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.detail(variables.issueId),
      });
    },
  });
};

// Get issue escalation
export const useIssueEscalation = (issueId: number, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.issues.escalation(issueId),
    queryFn: () => issuesApi.getEscalation(issueId),
    enabled: enabled && !!issueId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create issue escalation mutation (auditor)
export const useCreateIssueEscalation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      issueId,
      payload,
    }: {
      issueId: number;
      payload: CreateIssueEscalationCommentPayload;
    }) => issuesApi.createEscalation(issueId, payload),
    onSuccess: (_, variables) => {
      // Update escalation query
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.escalation(variables.issueId),
      });
      // Invalidate issue detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.detail(variables.issueId),
      });
    },
  });
};

// Update issue escalation mutation (judge response)
export const useUpdateIssueEscalation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      issueId,
      payload,
    }: {
      issueId: number;
      payload: UpdateIssueEscalationCommentPayload;
    }) => issuesApi.updateEscalation(issueId, payload),
    onSuccess: (_, variables) => {
      // Update escalation query
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.escalation(variables.issueId),
      });
      // Invalidate issue detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.detail(variables.issueId),
      });
    },
  });
};

// Update issue by auditor mutation
export const useUpdateIssueByAuditor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateIssueByAuditorPayload;
    }) => issuesApi.updateByAuditor(id, payload),
    onSuccess: (data, variables) => {
      // Update the specific issue query
      queryClient.setQueryData(queryKeys.issues.detail(variables.id), data);
      // Invalidate issues list
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.lists() });
      // Invalidate contest issues
      queryClient.invalidateQueries({
        queryKey: queryKeys.issues.byContest(data.contestId),
      });
      // Invalidate participation to update user's submitted issues
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.contests.detail(data.contestId), 'participation'],
      });
    },
  });
};

// Delete issue by auditor mutation
export const useDeleteIssueByAuditor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => issuesApi.deleteByAuditor(id),
    onMutate: async (issueId) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key.includes('participation');
        },
      });

      // Find all participation queries that might contain this issue
      const participationQueries = queryClient.getQueriesData<UserParticipationResponse>({
        predicate: (query) => {
          const key = query.queryKey;
          return Array.isArray(key) && key.includes('participation');
        },
      });

      // Store previous values for rollback
      const previousParticipations = new Map();

      // Optimistically update each participation query
      participationQueries.forEach(([queryKey, data]) => {
        if (data) {
          previousParticipations.set(queryKey, data);
          
          // Optimistically remove the issue from the participation response
          const updatedData: UserParticipationResponse = {
            ...data,
            issuesSubmitted: data.issuesSubmitted.filter(issue => issue.id !== issueId),
          };
          
          queryClient.setQueryData(queryKey, updatedData);
        }
      });

      return { previousParticipations };
    },
    onError: (error, issueId, context) => {
      // Rollback optimistic updates on error
      if (context?.previousParticipations) {
        context.previousParticipations.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: async (_, error, issueId) => {
      // Get the issue to know which contest it belonged to
      const issue = queryClient.getQueryData<IssueWithRelations>(
        queryKeys.issues.detail(issueId)
      );

      // Remove the specific issue query
      queryClient.removeQueries({ queryKey: queryKeys.issues.detail(issueId) });
      // Invalidate issues list
      queryClient.invalidateQueries({ queryKey: queryKeys.issues.lists() });

      // If we know the contest, invalidate its issues and participation
      if (issue?.contestId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.issues.byContest(issue.contestId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.contests.detail(issue.contestId),
        });
        // Invalidate participation to ensure consistency (optimistic update already done)
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.contests.detail(issue.contestId), 'participation'],
        });
      } else {
        // If we don't know the contest, invalidate all participation queries
        queryClient.invalidateQueries({
          predicate: (query) => {
            const key = query.queryKey;
            return Array.isArray(key) && key.includes('participation');
          },
        });
      }
    },
  });
};
