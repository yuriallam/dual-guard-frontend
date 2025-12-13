// Contest participation entity
export interface ContestParticipation {
  contestId: number;
  userId: number;
  joinedAt: string; // ISO timestamp
  issuesSubmitted: number;
  issuesApproved: number;
  totalRewardEarned: string; // decimal as string
}

// Contest participation with relations
export interface ContestParticipationWithRelations extends ContestParticipation {
  contest?: import('./contest').Contest;
  user?: import('./user').User;
}

// Join contest payload
export interface JoinContestPayload {
  contestId: number;
}

