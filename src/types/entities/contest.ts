import { ContestStatus, Severity } from './enums';

// Prize distribution type
export interface PrizeDistribution {
  CRITICAL?: number;
  HIGH?: number;
  MEDIUM?: number;
  LOW?: number;
  INFORMATIONAL?: number;
}

// Code location type
export interface CodeLocation {
  file?: string;
  line?: number;
  function?: string;
}

// Contest entity
export interface Contest {
  id: number;
  title: string;
  description: string | null;
  sponsorId: number;
  status: ContestStatus;
  contractAddress: string;
  contractName: string;
  sourceCodeUrl: string | null;
  documentationUrl: string | null;
  startDate: string; // ISO timestamp
  endDate: string; // ISO timestamp
  judgingEndDate: string | null; // ISO timestamp
  totalPrizePool: string; // decimal as string
  prizeTokenAddress: string | null;
  prizeDistribution: PrizeDistribution | null;
  maxIssuesPerAuditor: number | null;
  minSeverityForReward: Severity;
  tags: string[] | null;
  chain: string;
  photoUrl: string | null;
  githubRepoUrl: string | null;
  repoFileTree: Record<string, unknown> | null;
  repoStoragePath: string | null;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

// Contest with relations
export interface ContestWithRelations extends Contest {
  auditorsCount?: number;
  issueCount?: number;
}

// Contest creation/update payloads
export interface CreateContestPayload {
  title: string;
  description?: string;
  contractAddress: string;
  contractName: string;
  sourceCodeUrl?: string;
  documentationUrl?: string;
  startDate: string; // ISO timestamp
  endDate: string; // ISO timestamp
  judgingEndDate?: string; // ISO timestamp
  totalPrizePool: string;
  prizeTokenAddress?: string;
  prizeDistribution?: PrizeDistribution;
  maxIssuesPerAuditor?: number;
  minSeverityForReward?: Severity;
  tags?: string[];
  chain?: string;
  photoUrl?: string;
  githubRepoUrl?: string;
}

export interface UpdateContestPayload {
  title?: string;
  description?: string;
  status?: ContestStatus;
  contractAddress?: string;
  contractName?: string;
  sourceCodeUrl?: string;
  documentationUrl?: string;
  startDate?: string;
  endDate?: string;
  judgingEndDate?: string;
  totalPrizePool?: string;
  prizeTokenAddress?: string;
  prizeDistribution?: PrizeDistribution;
  maxIssuesPerAuditor?: number;
  minSeverityForReward?: Severity;
  tags?: string[];
  chain?: string;
  photoUrl?: string;
  githubRepoUrl?: string;
}

