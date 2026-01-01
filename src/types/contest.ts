export enum ContestStatusEnum {
  ACTIVE = 'ACTIVE',
  UPCOMING = 'UPCOMING',
  JUDGING = 'JUDGING',
  ESCALATIONS = 'ESCALATIONS',
  COMPLETED = 'COMPLETED',
}

export interface Contest {
  id: string;
  name: string;
  logo: string;
  prize: string;
  startDate: string;
  endDate: string;
  status: ContestStatusEnum;
  participants: number;
  type: string;
  description?: string;
  scope?: string[];
  highFindings?: number;
  mediumFindings?: number;
  lowFindings?: number;
}

export const ContestStatusLabels: Record<ContestStatusEnum, string> = {
  [ContestStatusEnum.ACTIVE]: 'Active',
  [ContestStatusEnum.UPCOMING]: 'Upcoming',
  [ContestStatusEnum.JUDGING]: 'Judging',
  [ContestStatusEnum.ESCALATIONS]: 'Escalations Open',
  [ContestStatusEnum.COMPLETED]: 'Finished',
};

export const statusColors: Record<ContestStatusEnum, string> = {
  [ContestStatusEnum.ACTIVE]: 'bg-green-500/10 text-green-400 border-green-500/30',
  [ContestStatusEnum.UPCOMING]: 'bg-cyan/10 text-cyan border-cyan/30',
  [ContestStatusEnum.JUDGING]: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  [ContestStatusEnum.ESCALATIONS]: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  [ContestStatusEnum.COMPLETED]: 'bg-muted text-muted-foreground border-border',
};
