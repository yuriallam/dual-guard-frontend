# API Hooks Documentation

This directory contains React Query hooks for all API operations. The hooks are organized by resource and provide a clean, type-safe interface to the backend API.

## Structure

```
src/hooks/api/
├── query-keys.ts    # Query key factories for type-safe cache management
├── auth.ts          # Authentication hooks
├── users.ts         # User management hooks
├── contests.ts       # Contest hooks
├── issues.ts        # Issue/finding hooks
└── index.ts         # Centralized exports
```

## Usage Examples

### Authentication

```typescript
import { useLogin, useSignUp, useCurrentUser, useLogout } from '@/hooks/api';

// Login
const LoginComponent = () => {
  const login = useLogin();
  
  const handleLogin = async () => {
    try {
      await login.mutateAsync({
        email: 'user@example.com',
        password: 'password123'
      });
      // Redirect on success
    } catch (error) {
      // Handle error
    }
  };
  
  return <button onClick={handleLogin}>Login</button>;
};

// Get current user
const ProfileComponent = () => {
  const { data: user, isLoading, error } = useCurrentUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user</div>;
  
  return <div>Welcome, {user?.username}!</div>;
};

// Logout
const LogoutButton = () => {
  const logout = useLogout();
  
  return (
    <button onClick={() => logout.mutate()}>
      {logout.isPending ? 'Logging out...' : 'Logout'}
    </button>
  );
};
```

### Contests

```typescript
import { useContests, useContest, useJoinContest } from '@/hooks/api';

// List contests
const ContestsList = () => {
  const { data, isLoading } = useContests({
    page: 1,
    limit: 10,
    status: 'ACTIVE'
  });
  
  if (isLoading) return <div>Loading contests...</div>;
  
  return (
    <div>
      {data?.data.map(contest => (
        <ContestCard key={contest.id} contest={contest} />
      ))}
    </div>
  );
};

// Get single contest
const ContestDetail = ({ contestId }: { contestId: number }) => {
  const { data: contest, isLoading } = useContest(contestId);
  
  if (isLoading) return <div>Loading...</div>;
  
  return <div>{contest?.title}</div>;
};

// Join contest
const JoinContestButton = ({ contestId }: { contestId: number }) => {
  const joinContest = useJoinContest();
  
  const handleJoin = () => {
    joinContest.mutate(contestId, {
      onSuccess: () => {
        // Show success message
      },
      onError: (error) => {
        // Handle error
      }
    });
  };
  
  return (
    <button onClick={handleJoin} disabled={joinContest.isPending}>
      {joinContest.isPending ? 'Joining...' : 'Join Contest'}
    </button>
  );
};
```

### Issues

```typescript
import { 
  useContestIssues, 
  useCreateIssue, 
  useIssueComments 
} from '@/hooks/api';

// Get issues for a contest
const ContestIssues = ({ contestId }: { contestId: number }) => {
  const { data, isLoading } = useContestIssues(contestId, {
    page: 1,
    limit: 20,
    severity: 'HIGH'
  });
  
  return (
    <div>
      {data?.data.map(issue => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
};

// Create issue
const SubmitIssueForm = ({ contestId }: { contestId: number }) => {
  const createIssue = useCreateIssue();
  
  const handleSubmit = async (formData: CreateIssuePayload) => {
    try {
      await createIssue.mutateAsync({
        ...formData,
        contestId
      });
      // Show success, close modal, etc.
    } catch (error) {
      // Handle error
    }
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
};

// Get issue comments
const IssueComments = ({ issueId }: { issueId: number }) => {
  const { data: comments } = useIssueComments(issueId);
  
  return (
    <div>
      {comments?.data.map(comment => (
        <Comment key={comment.id} comment={comment} />
      ))}
    </div>
  );
};
```

### Infinite Scroll

```typescript
import { useInfiniteContestIssues } from '@/hooks/api';

const InfiniteIssuesList = ({ contestId }: { contestId: number }) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteContestIssues(contestId);
  
  const issues = data?.pages.flatMap(page => page.data) ?? [];
  
  return (
    <div>
      {issues.map(issue => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
      
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
};
```

## Query Key Management

All query keys are managed through the `queryKeys` factory in `query-keys.ts`. This ensures:
- Type-safe query keys
- Consistent key structure
- Easy invalidation

```typescript
import { queryKeys } from '@/hooks/api';
import { useQueryClient } from '@tanstack/react-query';

// Invalidate all contest queries
queryClient.invalidateQueries({ queryKey: queryKeys.contests.all });

// Invalidate specific contest
queryClient.invalidateQueries({ 
  queryKey: queryKeys.contests.detail(contestId) 
});
```

## Best Practices

1. **Use mutations for write operations**: All create, update, delete operations use `useMutation`
2. **Use queries for read operations**: All fetch operations use `useQuery` or `useInfiniteQuery`
3. **Handle loading and error states**: Always check `isLoading`, `isError`, and `error` states
4. **Invalidate related queries**: Mutations automatically invalidate related queries, but you can manually invalidate if needed
5. **Use infinite queries for pagination**: Use `useInfiniteQuery` for infinite scroll scenarios
6. **Enable/disable queries conditionally**: Use the `enabled` option to conditionally fetch data

## Available Hooks

### Auth Hooks
- `useCurrentUser()` - Get current authenticated user
- `useLogin()` - Login mutation
- `useSignUp()` - Sign up mutation
- `useLogout()` - Logout mutation
- `useLogoutAll()` - Logout from all devices
- `useVerifyEmail()` - Verify email mutation
- `useResendVerificationEmail()` - Resend verification email

### User Hooks
- `useUsers(params?)` - Get paginated users list
- `useInfiniteUsers(params?)` - Get users with infinite scroll
- `useUser(id, enabled?)` - Get user by ID
- `useUserProfile()` - Get current user profile
- `useUpdateProfile()` - Update profile mutation

### Contest Hooks
- `useContests(params?)` - Get paginated contests list
- `useInfiniteContests(params?)` - Get contests with infinite scroll
- `useContest(id, enabled?)` - Get contest by ID
- `useCreateContest()` - Create contest mutation
- `useUpdateContest()` - Update contest mutation
- `useDeleteContest()` - Delete contest mutation
- `useJoinContest()` - Join contest mutation
- `useLeaveContest()` - Leave contest mutation
- `useContestParticipants(contestId, params?)` - Get contest participants

### Issue Hooks
- `useIssues(params?)` - Get paginated issues list
- `useInfiniteIssues(params?)` - Get issues with infinite scroll
- `useContestIssues(contestId, params?, enabled?)` - Get issues by contest
- `useInfiniteContestIssues(contestId, params?)` - Get contest issues with infinite scroll
- `useIssue(id, enabled?)` - Get issue by ID
- `useCreateIssue()` - Create issue mutation
- `useUpdateIssue()` - Update issue mutation
- `useDeleteIssue()` - Delete issue mutation
- `useIssueComments(issueId, params?, enabled?)` - Get issue comments
- `useCreateIssueComment()` - Create comment mutation
- `useIssueEscalation(issueId, enabled?)` - Get issue escalation
- `useCreateIssueEscalation()` - Create escalation mutation (auditor)
- `useUpdateIssueEscalation()` - Update escalation mutation (judge)

