import { UserRole, UserStatus } from "./enums";

// User entity returned from the API
// Note: some legacy fields are kept optional for compatibility
export interface User {
  id: number;
  email: string | null;
  username: string;
  bio: string | null;
  walletAddress: string | null;
  wallet: string | null;
  isBanned: boolean;
  isEmailVerified: boolean;
  isIdentityVerified: boolean;
  role: UserRole | string;
  avatarUrl: string | null;

  // Optional legacy fields (not always present from backend)
  status?: UserStatus;
  score?: string;
  totalRewards?: string;
  highIssueCount?: number;
  mediumIssueCount?: number;
  lowIssueCount?: number;
  githubUsername?: string | null;
  xUsername?: string | null;
  telegramUsername?: string | null;
  discordUsername?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// User creation/update payloads
export interface CreateUserPayload {
  walletAddress?: string;
  email?: string;
  username: string;
  password: string; // Only for creation, not stored in User type
}

export interface UpdateUserPayload {
  email?: string;
  username?: string;
  githubUsername?: string;
  xUsername?: string;
  telegramUsername?: string;
  discordUsername?: string;
  bio?: string;
  avatarUrl?: string;
  walletAddress?: string | null;
}
