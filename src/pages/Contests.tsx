import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContestCard from "@/components/ContestCard";
import { usePaginatedContests } from "@/hooks/api/contests";
import { transformContestForCard } from "@/lib/contests";
import { ContestStatusEnum } from "@/types/contest";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type FilterStatus = 'all' | 'ACTIVE' | 'UPCOMING' | 'JUDGING' | 'ESCALATIONS' | 'COMPLETED';

const statusFilters: { value: FilterStatus; label: string; apiValue?: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ACTIVE', label: 'Active', apiValue: 'ACTIVE' },
  { value: 'UPCOMING', label: 'Upcoming', apiValue: 'UPCOMING' },
  { value: 'JUDGING', label: 'Judging', apiValue: 'JUDGING' },
  { value: 'ESCALATIONS', label: 'Escalations Open', apiValue: 'ESCALATIONS' },
  { value: 'COMPLETED', label: 'Finished', apiValue: 'COMPLETED' },
];

const Contests = () => {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error } = usePaginatedContests({
    page,
    limit,
    status: activeFilter !== 'all' ? activeFilter : undefined,
  });

  const contests = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan/5 blur-3xl" />
        <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-purple/5 blur-3xl" />
        
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
              Security <span className="text-gradient">Contests</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse all active, upcoming, and completed security audits. Find vulnerabilities, earn rewards, and help secure the future of DeFi.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setActiveFilter(filter.value);
                  setPage(1); // Reset to first page when filter changes
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeFilter === filter.value
                    ? 'bg-gradient-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Contest Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(limit)].map((_, index) => (
                <div
                  key={index}
                  className="h-64 animate-pulse rounded-xl border border-border bg-card"
                />
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-full bg-muted p-6">
                <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-foreground">Failed to load contests</h3>
              <p className="mt-2 text-muted-foreground">Please try again later.</p>
            </div>
          ) : contests.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {contests.map((contest, index) => (
                  <Link 
                    key={contest.id} 
                    to={`/contests/${contest.id}`}
                    className="animate-fade-in-up block"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ContestCard {...transformContestForCard(contest)} />
                  </Link>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages || isLoading}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-full bg-muted p-6">
                <svg className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-foreground">No contests found</h3>
              <p className="mt-2 text-muted-foreground">There are no contests matching this filter right now.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contests;
