import { Link } from "react-router-dom";
import ContestCard from "./ContestCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { contests } from "@/data/contests";

// Show only active and upcoming contests on homepage
const featuredContests = contests.filter(c => c.status === 'active' || c.status === 'upcoming').slice(0, 4);

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
          <Link to="/contests">
            <Button variant="outline" className="shrink-0">
              View All Contests
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Contest Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {featuredContests.map((contest, index) => (
            <Link 
              key={contest.id}
              to={`/contests/${contest.id}`}
              className="animate-fade-in-up block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ContestCard {...contest} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActiveContests;
