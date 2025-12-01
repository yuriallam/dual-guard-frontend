export type Severity = "critical" | "high" | "medium" | "low" | "informational";

export interface Finding {
  id: string;
  contestId: string;
  severity: Severity;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string; // For demo, we'll use a mock user ID
}

export const severityOrder: Record<Severity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  informational: 4,
};

export const severityLabels: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  informational: "Informational",
};

export const severityColors: Record<Severity, string> = {
  critical: "bg-red-500/10 text-red-500 border-red-500/30",
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  informational: "bg-muted text-muted-foreground border-border",
};
