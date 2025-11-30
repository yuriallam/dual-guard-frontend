export interface Auditor {
  id: string;
  username: string;
  avatar: string;
  rank: number;
  highFindings: number;
  mediumFindings: number;
  lowFindings: number;
  totalEarnings: string;
  contestsParticipated: number;
  winRate: number;
}
