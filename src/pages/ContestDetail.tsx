import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, DollarSign, Users, FileCode, AlertTriangle, AlertCircle, Info, ExternalLink, Calendar, Plus, Scale } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContest, useContestParticipation, useJoinContest } from "@/hooks/api/contests";
import { useCreateIssue } from "@/hooks/api/issues";
import { transformContestForDetail } from "@/lib/contests";
import { statusColors, ContestStatusEnum, ContestStatusLabels } from "@/types/contest";
import { Finding, Severity } from "@/types/finding";
import { ReviewStatus } from "@/types/judge-review";
import { useFindings, useMockUserId } from "@/hooks/use-findings";
import { useJudgeReviews } from "@/hooks/use-judge-reviews";
import SubmitFindingDialog from "@/components/SubmitFindingDialog";
import FindingsList from "@/components/FindingsList";
import JudgeReviewPanel from "@/components/JudgeReviewPanel";
import { useAuth } from "@/hooks/use-auth";
import type { UserIssue } from "@/types/api/contest-participation";
import { useToast } from "@/hooks/use-toast";
import type { Severity as BackendSeverity } from "@/types/entities/enums";

// Map backend Severity enum to frontend Severity type
const mapSeverity = (severity: string): Severity => {
  const severityMap: Record<string, Severity> = {
    'HIGH': 'high',
    'MEDIUM': 'medium',
    'LOW': 'low',
  };
  return severityMap[severity.toUpperCase()] || 'low';
};

// Transform UserIssue to Finding format for compatibility with existing components
const transformIssueToFinding = (issue: UserIssue, contestId: string): Finding => {
  return {
    id: `issue-${issue.createdAt}`, // Temporary ID based on timestamp
    contestId,
    severity: mapSeverity(issue.severity),
    title: issue.title,
    content: issue.description,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
    authorId: 'current-user', // Will be replaced with actual user ID
  };
};

const ContestDetail = () => {
  const { id } = useParams();
  const contestId = id ? parseInt(id, 10) : null;
  const { isSignedIn } = useAuth();
  const { toast } = useToast();
  const { data: apiContest, isLoading, error } = useContest(contestId || 0, !!contestId);
  const { data: participation, isLoading: isLoadingParticipation } = useContestParticipation(
    contestId || 0,
    !!contestId && isSignedIn
  );
  const joinContestMutation = useJoinContest();
  const createIssueMutation = useCreateIssue();
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [editingFinding, setEditingFinding] = useState<Finding | null>(null);
  
  const { findings, createFinding, updateFinding, deleteFinding, getUserFindings } = useFindings(id || "");
  const { reviews, getReviewForFinding, upsertReview } = useJudgeReviews(id || "");
  const currentUserId = useMockUserId();
  
  // Mock: check if current user is a judge (for demo, we'll use a toggle or assume judge role in judging phase)
  const [isJudgeView, setIsJudgeView] = useState(false);

  // Transform API issues to Finding format
  const userIssuesFromAPI = useMemo(() => {
    if (!participation?.issuesSubmitted || !id) return [];
    return participation.issuesSubmitted.map(issue => transformIssueToFinding(issue, id));
  }, [participation?.issuesSubmitted, id]);

  const isParticipating = participation?.participated ?? false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 pt-32">
          <div className="h-8 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-4 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !apiContest || !contestId) {
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

  const contest = transformContestForDetail(apiContest);

  const isActive = contest.status === ContestStatusEnum.ACTIVE;
  const isJudging = contest.status === ContestStatusEnum.JUDGING || contest.status === ContestStatusEnum.ESCALATIONS;
  const showFindingsSummary = contest.status === ContestStatusEnum.JUDGING || contest.status === ContestStatusEnum.ESCALATIONS || contest.status === ContestStatusEnum.COMPLETED;

  // Get appropriate findings based on contest status
  // Use API issues if available, otherwise fall back to mock data
  const userFindings = isParticipating && userIssuesFromAPI.length > 0 
    ? userIssuesFromAPI 
    : getUserFindings();
  const displayFindings = isJudging ? findings : userFindings;

  const handleJoinContest = async () => {
    if (!contestId) return;
    try {
      await joinContestMutation.mutateAsync(contestId);
      toast({
        title: "Success",
        description: "You have successfully joined the contest!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join the contest. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Map frontend Severity to backend Severity enum
  const mapSeverityToBackend = (severity: Severity): BackendSeverity => {
    const severityMap: Record<Severity, BackendSeverity> = {
      'high': 'HIGH',
      'medium': 'MEDIUM',
      'low': 'LOW',
    };
    return severityMap[severity];
  };

  const handleSubmitFinding = async (data: { severity: Severity; title: string; content: string }) => {
    if (!contestId) {
      toast({
        title: "Error",
        description: "Contest ID is missing.",
        variant: "destructive",
      });
      throw new Error("Contest ID is missing");
    }

    if (editingFinding) {
      // TODO: Implement update issue API when available
      // For now, use mock update (synchronous)
      updateFinding(editingFinding.id, data);
      setEditingFinding(null);
      toast({
        title: "Finding updated",
        description: "Your finding has been updated successfully.",
      });
      // Return resolved promise for async compatibility
      return Promise.resolve();
    } else {
      await createIssueMutation.mutateAsync({
        contestId,
        title: data.title,
        description: data.content,
        severity: mapSeverityToBackend(data.severity),
      });
      
      toast({
        title: "Finding submitted",
        description: "Your finding has been submitted for review.",
      });
    }
  };

  const handleEditFinding = (finding: Finding) => {
    setEditingFinding(finding);
    setSubmitDialogOpen(true);
  };

  const handleDeleteFinding = (findingId: string) => {
    deleteFinding(findingId);
  };

  const handleDialogClose = (open: boolean) => {
    setSubmitDialogOpen(open);
    if (!open) {
      setEditingFinding(null);
    }
  };

  const handleReviewUpdate = (findingId: string, data: {
    judgeSelectedSeverity: Severity;
    comment: string;
    status: ReviewStatus;
  }) => {
    upsertReview(findingId, data);
  };

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
                    {contest.status === ContestStatusEnum.ACTIVE && (
                      <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                    )}
                    {ContestStatusLabels[contest.status]}
                  </span>
                </div>
                <p className="mt-2 text-lg text-muted-foreground">{contest.type}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              {isActive && isParticipating && (
                <Button variant="gradient" size="lg" onClick={() => setSubmitDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Submit Finding
                </Button>
              )}
              {isActive && !isParticipating && isSignedIn && (
                <Button 
                  variant="gradient" 
                  size="lg" 
                  onClick={handleJoinContest}
                  disabled={joinContestMutation.isPending}
                >
                  Join Contest
                </Button>
              )}
              {contest.status === ContestStatusEnum.UPCOMING && (
                <Button variant="gradient" size="lg">
                  Register Interest
                </Button>
              )}
              {contest.status === ContestStatusEnum.COMPLETED && (
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

              {/* My Findings (Active contests) */}
              {isActive && isParticipating && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl font-semibold text-foreground">My Findings</h2>
                    <Button variant="outline" size="sm" onClick={() => setSubmitDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Finding
                    </Button>
                  </div>
                  {userFindings.length > 0 ? (
                    <FindingsList
                      findings={userFindings}
                      isAnonymous={false}
                      onEdit={handleEditFinding}
                      onDelete={handleDeleteFinding}
                    />
                  ) : (
                    <div className="rounded-xl border border-border bg-card p-8 text-center">
                      <p className="text-muted-foreground">You haven't submitted any findings yet.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4" 
                        onClick={() => setSubmitDialogOpen(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Submit Your First Finding
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {isActive && !isParticipating && isSignedIn && (
                <div className="rounded-xl border border-border bg-card p-8 text-center">
                  <p className="text-muted-foreground mb-4">Join the contest to start submitting findings.</p>
                  <Button 
                    variant="gradient" 
                    onClick={handleJoinContest}
                    disabled={joinContestMutation.isPending}
                  >
                    Join Contest
                  </Button>
                </div>
              )}

              {/* Judging phase - tabbed view for auditor vs judge */}
              {isJudging && (
                <div>
                  <Tabs defaultValue="submissions" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Submissions
                      </h2>
                      <TabsList>
                        <TabsTrigger value="submissions">Auditor View</TabsTrigger>
                        <TabsTrigger value="judge" className="gap-2">
                          <Scale className="h-4 w-4" />
                          Judge View
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="submissions">
                      <FindingsList
                        findings={displayFindings}
                        isAnonymous={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="judge">
                      <JudgeReviewPanel
                        findings={findings}
                        reviews={reviews}
                        onReviewUpdate={handleReviewUpdate}
                        getReviewForFinding={getReviewForFinding}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Findings Summary (if judging/escalations/finished) */}
              {showFindingsSummary && (
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
        onOpenChange={handleDialogClose}
        contestName={contest.name}
        onSubmit={handleSubmitFinding}
        editingFinding={editingFinding}
      />
    </div>
  );
};

export default ContestDetail;
