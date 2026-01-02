import type { IssueStatus, Severity } from '@/types/entities/enums';

// Issue folder from participation response
export interface IssueFolder {
  id: number;
  name: string;
  tag: string;
  severity: Severity;
}

// Issue from participation response (subset of full Issue)
export interface UserIssue {
  title: string;
  severity: Severity;
  isValid: boolean;
  judgeSeverity: Severity | null;
  status: IssueStatus;
  description: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  folder: IssueFolder | null;
}

// Participation info from participation response
export interface ParticipationInfo {
  joinedAt: string; // ISO timestamp
}

// User participation response
export interface UserParticipationResponse {
  participated: boolean;
  participation: ParticipationInfo | null;
  issuesSubmitted: UserIssue[];
}

