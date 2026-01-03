import { useState } from "react";
import { Folder, FileText, Edit2, Trash2, ChevronRight, ChevronDown, Eye } from "lucide-react";
import { SeverityEnum, severityLabels, severityColors, severityOrder } from "@/types/finding";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FindingViewDialog from "./FindingViewDialog";
import { useAuth } from "@/hooks/use-auth";
import { UserIssue } from "@/types/api/contest-participation";

interface FindingsListProps {
  findings: UserIssue[];
  isAnonymous: boolean; // true during judging phase
  onEdit?: (finding: UserIssue) => void;
  onDelete?: (id: number) => void;
}

const FindingsList = ({ findings, isAnonymous, onEdit, onDelete }: FindingsListProps) => {
  const { user } = useAuth();
  const [expandedSeverities, setExpandedSeverities] = useState<Set<SeverityEnum>>(new Set( Object.values(SeverityEnum)));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [findingToDelete, setFindingToDelete] = useState<number | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<UserIssue | null>(null);

  // Group findings by severity
  const groupedFindings = findings.reduce((acc, finding) => {
    if (!acc[finding.severity]) {
      acc[finding.severity] = [];
    }
    acc[finding.severity].push(finding);
    return acc;
  }, {} as Record<SeverityEnum, UserIssue[]>);

  // Sort severities
  const sortedSeverities = (Object.keys(groupedFindings) as SeverityEnum[]).sort(
    (a, b) => severityOrder[a] - severityOrder[b]
  );

  const toggleSeverity = (severity: SeverityEnum) => {
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

  const handleDeleteClick = (id: number) => {
    setFindingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (findingToDelete && onDelete) {
      onDelete(findingToDelete);
    }
    setDeleteDialogOpen(false);
    setFindingToDelete(null);
  };

  const handleViewClick = (finding: UserIssue) => {
    setSelectedFinding(finding);
    setViewDialogOpen(true);
  };

  if (findings.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-muted-foreground">
          {isAnonymous ? "No findings submitted yet." : "You haven't submitted any findings yet."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-display font-semibold text-foreground">
            {isAnonymous ? "All Submissions" : "My Findings"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {isAnonymous 
              ? "Anonymous submissions grouped by severity" 
              : `${findings.length} finding${findings.length !== 1 ? 's' : ''} submitted`}
          </p>
        </div>

        <div className="divide-y divide-border">
          {sortedSeverities.map(severity => {
            const severityFindings = groupedFindings[severity];
            const isExpanded = expandedSeverities.has(severity);

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
                {isExpanded && (
                  <div className="bg-muted/20">
                    {severityFindings.map((finding, index) => {
                      const isOwner = finding.submittedBy === user?.id;
                      const displayName = isAnonymous 
                        ? finding.anonymousId
                        : finding.title;

                      return (
                        <div
                          key={finding.id}
                          className="flex items-center gap-3 px-4 py-2.5 pl-12 hover:bg-muted/50 transition-colors group"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-mono text-sm text-foreground truncate flex-1">
                            {displayName}
                          </span>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleViewClick(finding)}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                            {!isAnonymous && isOwner && onEdit && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => onEdit(finding)}
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            {!isAnonymous && isOwner && onDelete && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick(finding.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Finding</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this finding? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Finding Dialog */}
      <FindingViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        finding={selectedFinding}
        isAnonymous={isAnonymous}
      />
    </>
  );
};

export default FindingsList;
