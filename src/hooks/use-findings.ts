import { useState, useEffect, useCallback } from "react";
import { Finding, Severity } from "@/types/finding";

const STORAGE_KEY = "dualguard_findings";
const MOCK_USER_ID = "current-user-123"; // Mock user ID for demo

export const useMockUserId = () => MOCK_USER_ID;

export const useFindings = (contestId: string) => {
  const [findings, setFindings] = useState<Finding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load findings from localStorage
  const loadFindings = useCallback(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allFindings: Finding[] = JSON.parse(stored);
        const contestFindings = allFindings.filter(f => f.contestId === contestId);
        setFindings(contestFindings);
      }
    } catch (error) {
      console.error("Error loading findings:", error);
    } finally {
      setIsLoading(false);
    }
  }, [contestId]);

  useEffect(() => {
    loadFindings();
  }, [loadFindings]);

  // Get all findings (for storage operations)
  const getAllFindings = (): Finding[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  // Save all findings to localStorage
  const saveAllFindings = (allFindings: Finding[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allFindings));
  };

  // Create a new finding
  const createFinding = useCallback((data: {
    severity: Severity;
    title: string;
    content: string;
  }): Finding => {
    const newFinding: Finding = {
      id: `finding-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contestId,
      severity: data.severity,
      title: data.title,
      content: data.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: MOCK_USER_ID,
    };

    const allFindings = getAllFindings();
    allFindings.push(newFinding);
    saveAllFindings(allFindings);
    setFindings(prev => [...prev, newFinding]);

    return newFinding;
  }, [contestId]);

  // Update a finding
  const updateFinding = useCallback((id: string, data: {
    severity?: Severity;
    title?: string;
    content?: string;
  }) => {
    const allFindings = getAllFindings();
    const index = allFindings.findIndex(f => f.id === id);
    
    if (index !== -1) {
      allFindings[index] = {
        ...allFindings[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      saveAllFindings(allFindings);
      setFindings(prev => prev.map(f => f.id === id ? allFindings[index] : f));
    }
  }, []);

  // Delete a finding
  const deleteFinding = useCallback((id: string) => {
    const allFindings = getAllFindings();
    const filtered = allFindings.filter(f => f.id !== id);
    saveAllFindings(filtered);
    setFindings(prev => prev.filter(f => f.id !== id));
  }, []);

  // Get user's findings
  const getUserFindings = useCallback(() => {
    return findings.filter(f => f.authorId === MOCK_USER_ID);
  }, [findings]);

  return {
    findings,
    isLoading,
    createFinding,
    updateFinding,
    deleteFinding,
    getUserFindings,
    reload: loadFindings,
  };
};
