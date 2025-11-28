import { Clock, DollarSign, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContestCardProps {
  name: string;
  logo: string;
  prize: string;
  startDate: string;
  endDate: string;
  status: 'live' | 'upcoming' | 'completed';
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
  const statusColors = {
    live: 'bg-green-500/10 text-green-400 border-green-500/30',
    upcoming: 'bg-cyan/10 text-cyan border-cyan/30',
    completed: 'bg-muted text-muted-foreground border-border',
  };

  const statusLabels = {
    live: 'Live',
    upcoming: 'Upcoming',
    completed: 'Completed',
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:border-cyan/30 hover:shadow-elevated">
      {/* Gradient Hover Effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted">
              <span className="font-display text-xl font-bold text-gradient">{logo}</span>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{type}</p>
            </div>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[status]}`}>
            {status === 'live' && (
              <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            )}
            {statusLabels[status]}
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
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{startDate} - {endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{participants} auditors</span>
          </div>
        </div>

        {/* Action */}
        <div className="mt-6">
          <Button 
            variant={status === 'live' ? 'gradient' : 'outline'} 
            className="w-full"
          >
            {status === 'live' ? 'Join Contest' : status === 'upcoming' ? 'View Details' : 'View Report'}
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
