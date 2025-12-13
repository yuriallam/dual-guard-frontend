import { IssueStatus, Severity } from './enums';
import { CodeLocation } from './contest';

// Issue entity
export interface Issue {
  id: number;
  contestId: number;
  submittedBy: number;
  anonymousId: string | null;
  title: string;
  description: string;
  severity: Severity;
  status: IssueStatus;
  affectedContract: string | null;
  vulnerableCodeSnippet: string | null;
  codeLocation: CodeLocation | null;
  proofOfConcept: string | null;
  recommendedFix: string | null;
  cweId: string | null;
  cvssScore: string | null; // decimal as string
  rewardAmount: string | null; // decimal as string
  rewardPaid: boolean;
  rewardPaidAt: string | null; // ISO timestamp
  duplicateOf: number | null;
  judgedBy: number | null;
  judgedAt: string | null; // ISO timestamp
  judgeNotes: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Issue with relations
export interface IssueWithRelations extends Issue {
  contest?: import('./contest').Contest;
  submitter?: import('./user').User;
  judge?: import('./user').User;
  duplicateOfIssue?: Issue;
  duplicates?: Issue[];
  comments?: IssueComment[];
  escalation?: IssueEscalationComment | null;
}

// Issue creation/update payloads
export interface CreateIssuePayload {
  contestId: number;
  title: string;
  description: string;
  severity: Severity;
  affectedContract?: string;
  vulnerableCodeSnippet?: string;
  codeLocation?: CodeLocation;
  proofOfConcept?: string;
  recommendedFix?: string;
  cweId?: string;
  cvssScore?: string;
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  severity?: Severity;
  status?: IssueStatus;
  affectedContract?: string;
  vulnerableCodeSnippet?: string;
  codeLocation?: CodeLocation;
  proofOfConcept?: string;
  recommendedFix?: string;
  cweId?: string;
  cvssScore?: string;
  duplicateOf?: number | null;
  judgeNotes?: string;
}

// Issue comment entity
export interface IssueComment {
  id: number;
  issueId: number;
  userId: number;
  content: string;
  isInternal: boolean;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Issue comment with relations
export interface IssueCommentWithRelations extends IssueComment {
  issue?: Issue;
  user?: import('./user').User;
}

// Issue comment creation payload
export interface CreateIssueCommentPayload {
  issueId: number;
  content: string;
  isInternal?: boolean;
}

// Issue escalation comment entity
export interface IssueEscalationComment {
  id: number;
  issueId: number;
  auditorComment: string | null;
  judgeResponse: string | null;
  auditorCommentedAt: string | null; // ISO timestamp
  judgeRespondedAt: string | null; // ISO timestamp
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Issue escalation comment payloads
export interface CreateIssueEscalationCommentPayload {
  issueId: number;
  auditorComment: string;
}

export interface UpdateIssueEscalationCommentPayload {
  judgeResponse: string;
}

