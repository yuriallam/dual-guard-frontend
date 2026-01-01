// Query key factories for React Query
// This ensures type-safe and consistent query keys across the app

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
    profile: () => [...queryKeys.users.all, 'profile'] as const,
  },

  // Contests
  contests: {
    all: ['contests'] as const,
    lists: () => [...queryKeys.contests.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.contests.lists(), filters] as const,
    details: () => [...queryKeys.contests.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.contests.details(), id] as const,
    participants: (id: number) =>
      [...queryKeys.contests.detail(id), 'participants'] as const,
    activeUpcoming: () => [...queryKeys.contests.all, 'active-upcoming'] as const,
  },

  // Issues
  issues: {
    all: ['issues'] as const,
    lists: () => [...queryKeys.issues.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.issues.lists(), filters] as const,
    details: () => [...queryKeys.issues.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.issues.details(), id] as const,
    byContest: (contestId: number, filters?: Record<string, unknown>) =>
      [...queryKeys.issues.all, 'contest', contestId, filters] as const,
    comments: (issueId: number) =>
      [...queryKeys.issues.detail(issueId), 'comments'] as const,
    escalation: (issueId: number) =>
      [...queryKeys.issues.detail(issueId), 'escalation'] as const,
  },
} as const;

