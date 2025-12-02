import { Severity } from "./finding";

export type ReviewStatus = "pending" | "reviewed" | "needs-second-review" | "done";

export interface JudgeReview {
  id: string;
  findingId: string;
  contestId: string;
  judgeSelectedSeverity: Severity;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export const reviewStatusLabels: Record<ReviewStatus, string> = {
  pending: "Pending",
  reviewed: "Reviewed",
  "needs-second-review": "Needs Review",
  done: "Done",
};

export const reviewStatusColors: Record<ReviewStatus, string> = {
  pending: "bg-muted text-muted-foreground border-border",
  reviewed: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  "needs-second-review": "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  done: "bg-green-500/10 text-green-500 border-green-500/30",
};
