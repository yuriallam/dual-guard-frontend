import { Clock, DollarSign, Users } from "lucide-react";
import { ContestStatusEnum, ContestStatusLabels, statusColors } from "@/types/contest";

interface ContestCardProps {
  name: string;
  logo: string;
  prize: string;
  startDate: string;
  endDate: string;
  status: ContestStatusEnum;
  participants: number;
  type: string;
}

const ContestCard = ({
  name,
  logo,
  prize,
  startDate,
  endDate,
  status,
  participants,
  type,
}: ContestCardProps) => {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:border-cyan/30 hover:shadow-elevated h-full">
      {/* Gradient Hover Effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 min-h-[3.5rem]">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
              <span className="font-display text-xl font-bold text-gradient truncate">{logo}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-semibold text-foreground truncate">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">{type}</p>
            </div>
          </div>
          <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap ${statusColors[status]}`}>
            {status === ContestStatusEnum.ACTIVE && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            )}
            {ContestStatusLabels[status]}
          </span>
        </div>

        {/* Prize Pool */}
        <div className="mt-6 rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>Prize Pool</span>
          </div>
          <div className="mt-1 font-display text-2xl font-bold text-gradient">
            {prize}
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="truncate">{startDate} - {endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
            <Users className="h-4 w-4 shrink-0" />
            <span className="truncate">{participants} auditors</span>
          </div>
        </div>

        {/* Status indicator bar */}
        <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div 
            className={`h-full rounded-full ${
              status === ContestStatusEnum.ACTIVE ? 'bg-green-500 w-1/2' :
              status === ContestStatusEnum.UPCOMING ? 'bg-cyan w-0' :
              status === ContestStatusEnum.JUDGING ? 'bg-yellow-500 w-3/4' :
              status === ContestStatusEnum.ESCALATIONS ? 'bg-orange-500 w-7/8' :
              'bg-gradient-primary w-full'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
