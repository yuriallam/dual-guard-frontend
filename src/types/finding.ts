export type Severity =  "high" | "medium" | "low" ;

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
  high: 0,
  medium: 1,
  low: 2,
};

export const severityLabels: Record<Severity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const severityColors: Record<Severity, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/30",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/30",
};
