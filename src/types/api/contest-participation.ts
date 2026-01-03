import type { IssueStatus, Severity } from '@/types/entities/enums';
import { SeverityEnum } from '../finding';

// Issue folder from participation response
export interface IssueFolder {
  id: number;
  name: string;
  tag: string;
  severity: Severity;
}

// Issue from participation response (subset of full Issue)
export interface UserIssue {
  id: number;
  submittedBy: number;
  title: string;
  severity: SeverityEnum;
  isValid: boolean;
  anonymousId: string | null;
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

