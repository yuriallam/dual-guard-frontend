import { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, Info, ShieldAlert, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MarkdownEditor from "./MarkdownEditor";
import { useToast } from "@/hooks/use-toast";
import { Finding, Severity } from "@/types/finding";

interface SubmitFindingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contestName: string;
  onSubmit: (data: { severity: Severity; title: string; content: string }) => void;
  editingFinding?: Finding | null;
}

const severityConfig: Record<Severity, { label: string; icon: typeof AlertTriangle; color: string; description: string }> = {
  critical: {
    label: "Critical",
    icon: ShieldAlert,
    color: "text-red-500",
    description: "Direct loss of funds or permanent freezing"
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    color: "text-destructive",
    description: "Significant impact on protocol functionality or funds at risk"
  },
  medium: {
    label: "Medium",
    icon: AlertCircle,
    color: "text-yellow-500",
    description: "Conditional impact or limited loss potential"
  },
  low: {
    label: "Low",
    icon: Info,
    color: "text-blue-500",
    description: "Minor issues with minimal impact"
  },
  informational: {
    label: "Informational",
    icon: Info,
    color: "text-muted-foreground",
    description: "Best practices, code quality, or gas optimizations"
  }
};

const FINDING_TEMPLATE = `## Summary
Brief description of the vulnerability.

## Vulnerability Detail
Detailed explanation of the vulnerability and how it can be exploited.

## Impact
Describe the potential impact on the protocol and users.

## Code Snippet
\`\`\`solidity
// Paste the affected code here
\`\`\`

## Tool Used
Manual Review

## Recommendation
Describe how to fix the vulnerability.
`;

const SubmitFindingDialog = ({ open, onOpenChange, contestName, onSubmit, editingFinding }: SubmitFindingDialogProps) => {
  const { toast } = useToast();
  const [severity, setSeverity] = useState<Severity | "">("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(FINDING_TEMPLATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!editingFinding;

  // Populate form when editing
  useEffect(() => {
    if (editingFinding) {
      setSeverity(editingFinding.severity);
      setTitle(editingFinding.title);
      setContent(editingFinding.content);
    } else {
      setSeverity("");
      setTitle("");
      setContent(FINDING_TEMPLATE);
    }
  }, [editingFinding, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!severity || !title.trim() || !content.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit({ severity, title, content });
    
    toast({
      title: isEditing ? "Finding updated" : "Finding submitted",
      description: isEditing 
        ? "Your finding has been updated successfully."
        : "Your finding has been submitted for review.",
    });
    
    // Reset form
    setSeverity("");
    setTitle("");
    setContent(FINDING_TEMPLATE);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const selectedSeverity = severity ? severityConfig[severity] : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEditing ? "Edit Finding" : "Submit Finding"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? `Editing finding for ${contestName}`
              : `Submit a vulnerability finding for ${contestName}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Severity */}
          <div className="space-y-2">
            <Label htmlFor="severity">Severity *</Label>
            <Select value={severity} onValueChange={(value) => setSeverity(value as Severity)}>
              <SelectTrigger id="severity" className="w-full">
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(severityConfig) as [Severity, typeof severityConfig[Severity]][]).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${config.color}`} />
                        <span>{config.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedSeverity && (
              <p className="text-xs text-muted-foreground">
                {selectedSeverity.description}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Reentrancy vulnerability in withdraw function"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Be concise but descriptive about the vulnerability
            </p>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <Label>Description *</Label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Describe the vulnerability in detail..."
              minHeight="350px"
            />
            <p className="text-xs text-muted-foreground">
              Use markdown formatting. You can add images by clicking the image icon or pasting.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {isEditing ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Finding" : "Submit Finding"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitFindingDialog;
