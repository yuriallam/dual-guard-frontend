import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, DollarSign, Users, FileCode, AlertTriangle, AlertCircle, Info, ExternalLink, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { contests } from "@/data/contests";
import { statusLabels, statusColors } from "@/types/contest";
import SubmitFindingDialog from "@/components/SubmitFindingDialog";

const ContestDetail = () => {
  const { id } = useParams();
  const contest = contests.find(c => c.id === id);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);

  if (!contest) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 pt-32">
          <h1 className="font-display text-2xl font-bold text-foreground">Contest not found</h1>
          <p className="mt-2 text-muted-foreground">The contest you're looking for doesn't exist.</p>
          <Link to="/contests">
            <Button variant="gradient" className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contests
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const showFindings = contest.status === 'judging' || contest.status === 'escalations' || contest.status === 'finished';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-12">
        <div className="absolute inset-0 bg-gradient-subtle" />
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan/5 blur-3xl" />
        
        <div className="container relative mx-auto px-4">
          <Link 
            to="/contests" 
            className="mb-8 inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contests
          </Link>
          
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted">
                <span className="font-display text-2xl font-bold text-gradient">{contest.logo}</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
                    {contest.name}
                  </h1>
                  <span className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[contest.status]}`}>
                    {contest.status === 'active' && (
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                    )}
                    {statusLabels[contest.status]}
                  </span>
                </div>
                <p className="mt-2 text-lg text-muted-foreground">{contest.type}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {contest.status === 'active' && (
                <Button variant="gradient" size="lg" onClick={() => setSubmitDialogOpen(true)}>
                  Submit Finding
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
              {contest.status === 'upcoming' && (
                <Button variant="gradient" size="lg">
                  Register Interest
                </Button>
              )}
              {(contest.status === 'judging' || contest.status === 'escalations') && (
                <Button variant="gradient" size="lg">
                  View Submissions
                </Button>
              )}
              {contest.status === 'finished' && (
                <Button variant="outline" size="lg">
                  View Report
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="font-display text-xl font-semibold text-foreground">About</h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {contest.description}
                </p>
              </div>

              {/* Scope */}
              {contest.scope && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">Scope</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The following contracts are in scope for this audit:
                  </p>
                  <div className="mt-4 space-y-2">
                    {contest.scope.map((file, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-3 rounded-lg bg-muted/50 px-4 py-3"
                      >
                        <FileCode className="h-4 w-4 text-cyan" />
                        <span className="font-mono text-sm text-foreground">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Findings (if judging/escalations/finished) */}
              {showFindings && (
                <div className="rounded-xl border border-border bg-card p-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">Findings Summary</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-destructive/10 p-4">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        <span className="text-sm font-medium">High</span>
                      </div>
                      <p className="mt-2 font-display text-3xl font-bold text-destructive">
                        {contest.highFindings ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-yellow-500/10 p-4">
                      <div className="flex items-center gap-2 text-yellow-500">
                        <AlertCircle className="h-5 w-5" />
                        <span className="text-sm font-medium">Medium</span>
                      </div>
                      <p className="mt-2 font-display text-3xl font-bold text-yellow-500">
                        {contest.mediumFindings ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-blue-500/10 p-4">
                      <div className="flex items-center gap-2 text-blue-500">
                        <Info className="h-5 w-5" />
                        <span className="text-sm font-medium">Low</span>
                      </div>
                      <p className="mt-2 font-display text-3xl font-bold text-blue-500">
                        {contest.lowFindings ?? 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Prize Pool */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Total Prize Pool</span>
                </div>
                <p className="mt-2 font-display text-4xl font-bold text-gradient">
                  {contest.prize}
                </p>
              </div>

              {/* Timeline */}
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-display font-semibold text-foreground">Timeline</h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-cyan/10 p-2">
                      <Calendar className="h-4 w-4 text-cyan" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Start Date</p>
                      <p className="font-medium text-foreground">{contest.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-purple/10 p-2">
                      <Clock className="h-4 w-4 text-purple" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">End Date</p>
                      <p className="font-medium text-foreground">{contest.endDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participants */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Registered Auditors</span>
                </div>
                <p className="mt-2 font-display text-3xl font-bold text-foreground">
                  {contest.participants}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Submit Finding Dialog */}
      <SubmitFindingDialog
        open={submitDialogOpen}
        onOpenChange={setSubmitDialogOpen}
        contestName={contest.name}
      />
    </div>
  );
};

export default ContestDetail;
