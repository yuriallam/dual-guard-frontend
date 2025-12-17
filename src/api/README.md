# API Integration Guide

This directory contains a clean, organized API integration for the DualGuard frontend.

## Structure

```
src/api/
├── client.ts      # Base API client with error handling and auth
├── config.ts      # API configuration and endpoints
├── auth.ts        # Authentication API
├── users.ts       # Users API
├── contests.ts    # Contests API
├── issues.ts      # Issues API
└── index.ts       # Exports

src/types/
├── entities/      # Entity types from backend schema
│   ├── enums.ts
│   ├── user.ts
│   ├── contest.ts
│   ├── contest-participation.ts
│   ├── issue.ts
│   └── index.ts
└── api/           # API-specific types
    ├── common.ts
    ├── auth.ts
    └── index.ts
```

## Configuration

Set the `VITE_API_BASE_URL` environment variable in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

If not set, it defaults to `http://localhost:3000/api`.

## Usage

### Authentication

```typescript
import { authApi } from "@/api";

// Login (sign in)
const { accessToken, refreshToken } = await authApi.login({
  email: "user@example.com",
  password: "password123",
});
// Tokens are automatically stored in localStorage

// Sign up
const { success, message } = await authApi.signUp({
  username: "johndoe",
  email: "user@example.com",
  password: "password123",
});

// Get current user
const user = await authApi.getCurrentUser();

// Logout
await authApi.logout();
// Tokens are automatically cleared

// Logout from all devices
await authApi.logoutAll();

// Verify email
await authApi.verifyEmail({ token: "verification-token" });

// Resend verification email
await authApi.resendVerificationEmail({ email: "user@example.com" });
```

### Contests

```typescript
import { contestsApi } from "@/api";

// Get all contests
const { data, pagination } = await contestsApi.getAll({
  page: 1,
  limit: 10,
  status: "ACTIVE",
});

// Get contest by ID
const contest = await contestsApi.getById(1);

// Create contest
const newContest = await contestsApi.create({
  title: "New Contest",
  contractAddress: "0x...",
  contractName: "MyContract",
  startDate: "2024-01-01T00:00:00Z",
  endDate: "2024-01-31T23:59:59Z",
  totalPrizePool: "10000",
});

// Join contest
await contestsApi.join(1);
```

### Issues

```typescript
import { issuesApi } from "@/api";

// Get issues by contest
const { data } = await issuesApi.getByContest(1, {
  page: 1,
  limit: 20,
  severity: "HIGH",
});

// Create issue
const issue = await issuesApi.create({
  contestId: 1,
  title: "Vulnerability Found",
  description: "Detailed description...",
  severity: "HIGH",
});

// Add comment
await issuesApi.createComment(1, {
  issueId: 1,
  content: "This is a comment",
  isInternal: false,
});
```

### Users

```typescript
import { usersApi } from "@/api";

// Get user profile
const profile = await usersApi.getProfile();

// Update profile
const updated = await usersApi.updateProfile({
  bio: "Updated bio",
  githubUsername: "githubuser",
});
```

## Error Handling

The API client automatically handles:

- Token refresh on 401 errors
- Error parsing and formatting
- Network errors

Errors are thrown as `ApiClientError` instances:

```typescript
import { ApiClientError } from "@/api";

try {
  await contestsApi.getById(1);
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
  }
}
```

## React Query Integration

The API clients work seamlessly with React Query:

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { contestsApi } from "@/api";

// Query
const { data, isLoading } = useQuery({
  queryKey: ["contests", contestId],
  queryFn: () => contestsApi.getById(contestId),
});

// Mutation
const mutation = useMutation({
  mutationFn: (data) => contestsApi.create(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["contests"] });
  },
});
```

## Token Management

Tokens are automatically stored in localStorage and managed by the API client. The client:

- Automatically adds the access token to requests
- Refreshes tokens when they expire
- Clears tokens on sign out or refresh failure

## Type Safety

All API methods are fully typed. Entity types match the backend schema (excluding sensitive fields like passwords).
