import type { ContestWithRelations } from "@/types/entities/contest";
import { ContestStatusEnum } from "@/types/contest";
import type { Contest } from "@/types/contest";

// Helper function to format date to short format (e.g., "Nov 28")
export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
};

// Helper function to format prize pool
export const formatPrize = (prizePool: string): string => {
  const amount = parseFloat(prizePool);
  if (isNaN(amount)) return prizePool;
  
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
};

// Helper function to generate logo from title
export const getLogoFromTitle = (title: string): string => {
  const words = title.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return title.substring(0, 2).toUpperCase();
};

// Helper function to get contest type from tags or description
export const getContestType = (contest: ContestWithRelations): string => {
  if (contest.tags && contest.tags.length > 0) {
    return contest.tags[0];
  }
  // Extract type from description or use a default
  return contest.description?.split(' ')[0] || 'Smart Contract';
};

// Map backend ContestStatus to frontend ContestStatusEnum
const mapContestStatus = (status: string): ContestStatusEnum => {
  const statusMap: Record<string, ContestStatusEnum> = {
    'ACTIVE': ContestStatusEnum.ACTIVE,
    'UPCOMING': ContestStatusEnum.UPCOMING,
    'JUDGING': ContestStatusEnum.JUDGING,
    'ESCALATIONS': ContestStatusEnum.ESCALATIONS,
    'COMPLETED': ContestStatusEnum.COMPLETED,
    'DRAFT': ContestStatusEnum.UPCOMING, // Map DRAFT to UPCOMING for display
    'CANCELLED': ContestStatusEnum.COMPLETED, // Map CANCELLED to COMPLETED for display
  };
  return statusMap[status] || ContestStatusEnum.UPCOMING;
};

// Transform API contest to ContestCard props
export const transformContestForCard = (contest: ContestWithRelations): Omit<Contest, 'id' | 'description' | 'scope' | 'highFindings' | 'mediumFindings' | 'lowFindings'> => {
  return {
    name: contest.title,
    logo: getLogoFromTitle(contest.title),
    prize: formatPrize(contest.totalPrizePool),
    startDate: formatShortDate(contest.startDate),
    endDate: formatShortDate(contest.endDate),
    status: mapContestStatus(contest.status),
    participants: contest.participantCount || 0,
    type: getContestType(contest),
  };
};

// Transform API contest to full Contest type (for detail page)
export const transformContestForDetail = (contest: ContestWithRelations): Contest => {
  return {
    id: contest.id.toString(),
    name: contest.title,
    logo: getLogoFromTitle(contest.title),
    prize: formatPrize(contest.totalPrizePool),
    startDate: formatShortDate(contest.startDate),
    endDate: formatShortDate(contest.endDate),
    status: mapContestStatus(contest.status),
    participants: contest.participantCount || 0,
    type: getContestType(contest),
    description: contest.description || undefined,
    scope: contest.contractName ? [contest.contractName] : undefined,
  };
};

