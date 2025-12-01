import { AlertTriangle, AlertCircle, Info, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Finding, Severity, severityLabels, severityColors } from "@/types/finding";

interface FindingViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finding: Finding | null;
  isAnonymous: boolean;
}

const severityIcons: Record<Severity, typeof AlertTriangle> = {
  critical: ShieldAlert,
  high: AlertTriangle,
  medium: AlertCircle,
  low: Info,
  informational: Info,
};

const FindingViewDialog = ({ open, onOpenChange, finding, isAnonymous }: FindingViewDialogProps) => {
  if (!finding) return null;

  const Icon = severityIcons[finding.severity];

  // Simple markdown to HTML conversion for preview
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-md font-semibold text-foreground mt-3 mb-1">{line.slice(4)}</h3>;
        }
        // Code blocks (simplified)
        if (line.startsWith('```')) {
          return null;
        }
        // Empty lines
        if (line.trim() === '') {
          return <br key={i} />;
        }
        // Regular text
        return <p key={i} className="text-muted-foreground">{line}</p>;
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className={`rounded-full border px-3 py-1 text-xs font-medium flex items-center gap-1.5 ${severityColors[finding.severity]}`}>
              <Icon className="h-3.5 w-3.5" />
              {severityLabels[finding.severity]}
            </span>
          </div>
          <DialogTitle className="font-display text-xl mt-2">
            {isAnonymous ? `Finding #${finding.id.slice(-6)}` : finding.title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 prose prose-invert max-w-none">
          {renderContent(finding.content)}
        </div>

        {!isAnonymous && (
          <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
            <p>Created: {new Date(finding.createdAt).toLocaleString()}</p>
            {finding.updatedAt !== finding.createdAt && (
              <p>Last updated: {new Date(finding.updatedAt).toLocaleString()}</p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FindingViewDialog;
