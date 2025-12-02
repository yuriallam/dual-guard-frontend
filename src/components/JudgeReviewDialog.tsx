import { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, Info, ShieldAlert, CheckCircle2, Users, Clock, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Finding, Severity, severityLabels, severityColors } from "@/types/finding";
import { JudgeReview, ReviewStatus, reviewStatusLabels, reviewStatusColors } from "@/types/judge-review";

interface JudgeReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finding: Finding | null;
  existingReview?: JudgeReview;
  onSave: (data: {
    judgeSelectedSeverity: Severity;
    comment: string;
    status: ReviewStatus;
  }) => void;
}

const severityIcons: Record<Severity, typeof AlertTriangle> = {
  critical: ShieldAlert,
  high: AlertTriangle,
  medium: AlertCircle,
  low: Info,
  informational: Info,
};

const statusIcons: Record<ReviewStatus, typeof Clock> = {
  pending: Clock,
  reviewed: Eye,
  "needs-second-review": Users,
  done: CheckCircle2,
};

const JudgeReviewDialog = ({ 
  open, 
  onOpenChange, 
  finding, 
  existingReview,
  onSave 
}: JudgeReviewDialogProps) => {
  const [selectedSeverity, setSelectedSeverity] = useState<Severity>("medium");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<ReviewStatus>("pending");

  // Reset form when finding changes
  useEffect(() => {
    if (finding) {
      setSelectedSeverity(existingReview?.judgeSelectedSeverity || finding.severity);
      setComment(existingReview?.comment || "");
      setStatus(existingReview?.status || "pending");
    }
  }, [finding, existingReview]);

  if (!finding) return null;

  const Icon = severityIcons[finding.severity];

  // Simple markdown to HTML conversion for preview
  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-md font-semibold text-foreground mt-3 mb-1">{line.slice(4)}</h3>;
      }
      if (line.startsWith('```')) {
        return null;
      }
      if (line.trim() === '') {
        return <br key={i} />;
      }
      return <p key={i} className="text-muted-foreground">{line}</p>;
    });
  };

  const handleSave = () => {
    onSave({
      judgeSelectedSeverity: selectedSeverity,
      comment,
      status,
    });
  };

  const severityChanged = selectedSeverity !== finding.severity;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className={`rounded-full border px-3 py-1 text-xs font-medium flex items-center gap-1.5 ${severityColors[finding.severity]}`}>
              <Icon className="h-3.5 w-3.5" />
              {severityLabels[finding.severity]}
              <span className="text-muted-foreground">(submitted)</span>
            </span>
          </div>
          <DialogTitle className="font-display text-xl mt-2">
            Finding #{finding.id.slice(-6)}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          {/* Finding Content */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 max-h-[300px] overflow-y-auto">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Submission Content</h4>
            <div className="prose prose-invert max-w-none">
              {renderContent(finding.content)}
            </div>
          </div>

          {/* Judge Review Section */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground">Judge Review</h4>
            
            {/* Severity Selection */}
            <div className="space-y-2">
              <Label>Assigned Severity</Label>
              <Select value={selectedSeverity} onValueChange={(v) => setSelectedSeverity(v as Severity)}>
                <SelectTrigger className={severityChanged ? "border-yellow-500/50" : ""}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(severityLabels) as Severity[]).map(sev => {
                    const SevIcon = severityIcons[sev];
                    return (
                      <SelectItem key={sev} value={sev}>
                        <div className="flex items-center gap-2">
                          <SevIcon className={`h-4 w-4 ${severityColors[sev].split(' ')[1]}`} />
                          {severityLabels[sev]}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {severityChanged && (
                <p className="text-xs text-yellow-500">
                  Severity changed from "{severityLabels[finding.severity]}" to "{severityLabels[selectedSeverity]}"
                </p>
              )}
            </div>

            {/* Review Status */}
            <div className="space-y-2">
              <Label>Review Status</Label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(reviewStatusLabels) as ReviewStatus[]).map(s => {
                  const StatusIcon = statusIcons[s];
                  const isActive = status === s;
                  return (
                    <Button
                      key={s}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatus(s)}
                      className={isActive ? "" : reviewStatusColors[s]}
                    >
                      <StatusIcon className="h-4 w-4 mr-1.5" />
                      {reviewStatusLabels[s]}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <Label>Judge Notes / Comment</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add any notes, comments, or reasoning for your review..."
                rows={4}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t border-border pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="gradient" onClick={handleSave}>
            Save Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JudgeReviewDialog;
