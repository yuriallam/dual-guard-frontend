import { useState } from "react";
import { 
  Folder, FileText, ChevronRight, ChevronDown, Eye, 
  MessageSquare, CheckCircle2, AlertTriangle, Users,
  Filter
} from "lucide-react";
import { Finding, Severity, severityLabels, severityColors, severityOrder } from "@/types/finding";
import { JudgeReview, ReviewStatus, reviewStatusLabels, reviewStatusColors } from "@/types/judge-review";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import JudgeReviewDialog from "./JudgeReviewDialog";

interface JudgeReviewPanelProps {
  findings: Finding[];
  reviews: JudgeReview[];
  onReviewUpdate: (findingId: string, data: {
    judgeSelectedSeverity: Severity;
    comment: string;
    status: ReviewStatus;
  }) => void;
  getReviewForFinding: (findingId: string) => JudgeReview | undefined;
}

type FilterStatus = "all" | ReviewStatus;

const JudgeReviewPanel = ({ 
  findings, 
  reviews, 
  onReviewUpdate,
  getReviewForFinding 
}: JudgeReviewPanelProps) => {
  const [expandedSeverities, setExpandedSeverities] = useState<Set<Severity>>(
    new Set(["critical", "high", "medium", "low", "informational"])
  );
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Group findings by severity
  const groupedFindings = findings.reduce((acc, finding) => {
    if (!acc[finding.severity]) {
      acc[finding.severity] = [];
    }
    acc[finding.severity].push(finding);
    return acc;
  }, {} as Record<Severity, Finding[]>);

  // Sort severities
  const sortedSeverities = (Object.keys(groupedFindings) as Severity[]).sort(
    (a, b) => severityOrder[a] - severityOrder[b]
  );

  const toggleSeverity = (severity: Severity) => {
    setExpandedSeverities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(severity)) {
        newSet.delete(severity);
      } else {
        newSet.add(severity);
      }
      return newSet;
    });
  };

  const handleReviewClick = (finding: Finding) => {
    setSelectedFinding(finding);
    setReviewDialogOpen(true);
  };

  const getReviewStatus = (findingId: string): ReviewStatus => {
    const review = getReviewForFinding(findingId);
    return review?.status || "pending";
  };

  const getStatusIcon = (status: ReviewStatus) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
      case "needs-second-review":
        return <Users className="h-3.5 w-3.5 text-yellow-500" />;
      case "reviewed":
        return <Eye className="h-3.5 w-3.5 text-blue-500" />;
      default:
        return null;
    }
  };

  // Filter findings based on status
  const filterFindings = (findingsList: Finding[]): Finding[] => {
    if (filterStatus === "all") return findingsList;
    return findingsList.filter(f => getReviewStatus(f.id) === filterStatus);
  };

  // Stats
  const stats = {
    total: findings.length,
    pending: findings.filter(f => getReviewStatus(f.id) === "pending").length,
    reviewed: findings.filter(f => getReviewStatus(f.id) === "reviewed").length,
    needsReview: findings.filter(f => getReviewStatus(f.id) === "needs-second-review").length,
    done: findings.filter(f => getReviewStatus(f.id) === "done").length,
  };

  if (findings.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">No submissions to review.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Stats Bar */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1.5">
            <span className="text-muted-foreground">Total:</span> {stats.total}
          </Badge>
          <Badge variant="outline" className={reviewStatusColors["pending"]}>
            Pending: {stats.pending}
          </Badge>
          <Badge variant="outline" className={reviewStatusColors["reviewed"]}>
            Reviewed: {stats.reviewed}
          </Badge>
          <Badge variant="outline" className={reviewStatusColors["needs-second-review"]}>
            Needs Review: {stats.needsReview}
          </Badge>
          <Badge variant="outline" className={reviewStatusColors["done"]}>
            Done: {stats.done}
          </Badge>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Submissions</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="needs-second-review">Needs Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Findings List */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h3 className="font-display font-semibold text-foreground">
              Judge Review Panel
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Review submissions, adjust severity, and track progress
            </p>
          </div>

          <div className="divide-y divide-border">
            {sortedSeverities.map(severity => {
              const severityFindings = filterFindings(groupedFindings[severity] || []);
              const isExpanded = expandedSeverities.has(severity);
              
              if (severityFindings.length === 0 && filterStatus !== "all") return null;

              return (
                <div key={severity}>
                  {/* Folder Header */}
                  <button
                    onClick={() => toggleSeverity(severity)}
                    className="flex w-full items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Folder className={`h-4 w-4 ${severityColors[severity].split(' ')[1]}`} />
                    <span className="font-medium text-foreground">{severityLabels[severity]}</span>
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-xs ${severityColors[severity]}`}>
                      {severityFindings.length}
                    </span>
                  </button>

                  {/* Files */}
                  {isExpanded && severityFindings.length > 0 && (
                    <div className="bg-muted/20">
                      {severityFindings.map((finding, index) => {
                        const status = getReviewStatus(finding.id);
                        const review = getReviewForFinding(finding.id);
                        const hasComment = review?.comment && review.comment.trim() !== "";

                        return (
                          <div
                            key={finding.id}
                            className="flex items-center gap-3 px-4 py-2.5 pl-12 hover:bg-muted/50 transition-colors group cursor-pointer"
                            onClick={() => handleReviewClick(finding)}
                          >
                            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="font-mono text-sm text-foreground truncate flex-1">
                              {index + 1}.md
                            </span>
                            
                            {/* Status indicators */}
                            <div className="flex items-center gap-2">
                              {hasComment && (
                                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                              {getStatusIcon(status)}
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${reviewStatusColors[status]}`}
                              >
                                {reviewStatusLabels[status]}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <JudgeReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        finding={selectedFinding}
        existingReview={selectedFinding ? getReviewForFinding(selectedFinding.id) : undefined}
        onSave={(data) => {
          if (selectedFinding) {
            onReviewUpdate(selectedFinding.id, data);
          }
          setReviewDialogOpen(false);
        }}
      />
    </>
  );
};

export default JudgeReviewPanel;
