import { useState, useEffect, useCallback } from "react";
import { JudgeReview, ReviewStatus } from "@/types/judge-review";
import { Severity } from "@/types/finding";

const STORAGE_KEY = "dualguard_judge_reviews";

export const useJudgeReviews = (contestId: string) => {
  const [reviews, setReviews] = useState<JudgeReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reviews from localStorage
  const loadReviews = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allReviews: JudgeReview[] = JSON.parse(stored);
        const contestReviews = allReviews.filter(r => r.contestId === contestId);
        setReviews(contestReviews);
      }
    } catch (error) {
      console.error("Error loading judge reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Get all reviews (for storage operations)
  const getAllReviews = (): JudgeReview[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Save all reviews to localStorage
  const saveAllReviews = (allReviews: JudgeReview[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allReviews));
  };

  // Get review for a specific finding
  const getReviewForFinding = useCallback((findingId: string): JudgeReview | undefined => {
    return reviews.find(r => r.findingId === findingId);
  }, [reviews]);

  // Create or update a review
  const upsertReview = useCallback((findingId: string, data: {
    judgeSelectedSeverity: Severity;
    comment: string;
    status: ReviewStatus;
  }): JudgeReview => {
    const allReviews = getAllReviews();
    const existingIndex = allReviews.findIndex(
      r => r.findingId === findingId && r.contestId === contestId
    );

    const now = new Date().toISOString();

    if (existingIndex !== -1) {
      // Update existing review
      allReviews[existingIndex] = {
        ...allReviews[existingIndex],
        ...data,
        updatedAt: now,
      };
      saveAllReviews(allReviews);
      setReviews(prev => prev.map(r => 
        r.findingId === findingId ? allReviews[existingIndex] : r
      ));
      return allReviews[existingIndex];
    } else {
      // Create new review
      const newReview: JudgeReview = {
        id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        findingId,
        contestId,
        ...data,
        createdAt: now,
        updatedAt: now,
      };
      allReviews.push(newReview);
      saveAllReviews(allReviews);
      setReviews(prev => [...prev, newReview]);
      return newReview;
    }
  }, [contestId]);

  // Quick status update
  const updateStatus = useCallback((findingId: string, status: ReviewStatus) => {
    const existing = getReviewForFinding(findingId);
    if (existing) {
      upsertReview(findingId, {
        judgeSelectedSeverity: existing.judgeSelectedSeverity,
        comment: existing.comment,
        status,
      });
    }
  }, [getReviewForFinding, upsertReview]);

  // Get stats
  const getStats = useCallback(() => {
    const stats = {
      total: reviews.length,
      pending: reviews.filter(r => r.status === "pending").length,
      reviewed: reviews.filter(r => r.status === "reviewed").length,
      needsSecondReview: reviews.filter(r => r.status === "needs-second-review").length,
      done: reviews.filter(r => r.status === "done").length,
    };
    return stats;
  }, [reviews]);

  return {
    reviews,
    isLoading,
    getReviewForFinding,
    upsertReview,
    updateStatus,
    getStats,
    reload: loadReviews,
  };
};
