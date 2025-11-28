import ContestCard from "./ContestCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const contests = [
  {
    name: "DeFi Protocol X",
    logo: "DX",
    prize: "$150,000",
    startDate: "Nov 28",
    endDate: "Dec 12",
    status: 'live' as const,
    participants: 127,
    type: "DeFi Lending Protocol",
  },
  {
    name: "NFT Marketplace",
    logo: "NM",
    prize: "$75,000",
    startDate: "Dec 1",
    endDate: "Dec 15",
    status: 'upcoming' as const,
    participants: 0,
    type: "NFT Trading Platform",
  },
  {
    name: "Bridge Protocol",
    logo: "BP",
    prize: "$200,000",
    startDate: "Dec 5",
    endDate: "Dec 20",
    status: 'upcoming' as const,
    participants: 0,
    type: "Cross-chain Bridge",
  },
  {
    name: "Yield Aggregator",
    logo: "YA",
    prize: "$100,000",
    startDate: "Nov 15",
    endDate: "Nov 30",
    status: 'live' as const,
    participants: 89,
    type: "Yield Optimization",
  },
];

const ActiveContests = () => {
  return (
    <section id="contests" className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-purple/5 blur-3xl" />

      <div className="container relative mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Active <span className="text-gradient">Contests</span>
            </h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Explore ongoing and upcoming security audits. Find bugs, earn rewards.
            </p>
          </div>
          <Button variant="outline" className="shrink-0">
            View All Contests
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Contest Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {contests.map((contest, index) => (
            <div 
              key={index}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ContestCard {...contest} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActiveContests;
