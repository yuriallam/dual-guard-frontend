export type ContestStatus = 'active' | 'upcoming' | 'judging' | 'escalations' | 'finished';

export interface Contest {
  id: string;
  name: string;
  logo: string;
  prize: string;
  startDate: string;
  endDate: string;
  status: ContestStatus;
  participants: number;
  type: string;
  description?: string;
  scope?: string[];
  highFindings?: number;
  mediumFindings?: number;
  lowFindings?: number;
}

export const statusLabels: Record<ContestStatus, string> = {
  active: 'Active',
  upcoming: 'Upcoming',
  judging: 'Judging',
  escalations: 'Escalations Open',
  finished: 'Finished',
};

export const statusColors: Record<ContestStatus, string> = {
  active: 'bg-green-500/10 text-green-400 border-green-500/30',
  upcoming: 'bg-cyan/10 text-cyan border-cyan/30',
  judging: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  escalations: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  finished: 'bg-muted text-muted-foreground border-border',
};
