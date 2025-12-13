import { UserRole, UserStatus } from './enums';

// User entity (excluding passwordHash and other sensitive fields)
export interface User {
  id: number;
  walletAddress: string | null;
  email: string | null;
  username: string;
  role: UserRole;
  status: UserStatus;
  score: string; // decimal as string
  totalRewards: string; // decimal as string
  highIssueCount: number;
  mediumIssueCount: number;
  lowIssueCount: number;
  githubUsername: string | null;
  xUsername: string | null;
  telegramUsername: string | null;
  discordUsername: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
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
}

