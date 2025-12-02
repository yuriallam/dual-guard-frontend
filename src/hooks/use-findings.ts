import { useState, useEffect, useCallback } from "react";
import { Finding, Severity } from "@/types/finding";

const STORAGE_KEY = "dualguard_findings";
const SEEDED_KEY = "dualguard_findings_seeded";
const MOCK_USER_ID = "current-user-123"; // Mock user ID for demo

export const useMockUserId = () => MOCK_USER_ID;

// Mock findings for demo purposes
const MOCK_FINDINGS: Finding[] = [
  {
    id: "finding-demo-001",
    contestId: "perpetual-dex",
    severity: "critical",
    title: "Reentrancy in withdrawal function",
    content: `## Summary
The \`withdraw()\` function in PerpEngine.sol is vulnerable to reentrancy attacks.

## Vulnerability Detail
The function updates the user's balance after the external call, allowing an attacker to recursively call withdraw before the balance is updated.

\`\`\`solidity
function withdraw(uint256 amount) external {
    require(balances[msg.sender] >= amount);
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount; // Updated after external call
}
\`\`\`

## Impact
Complete drainage of contract funds.

## Recommendation
Use checks-effects-interactions pattern or ReentrancyGuard.`,
    createdAt: "2024-11-20T10:30:00Z",
    updatedAt: "2024-11-20T10:30:00Z",
    authorId: "auditor-001",
  },
  {
    id: "finding-demo-002",
    contestId: "perpetual-dex",
    severity: "critical",
    title: "Oracle manipulation via flash loan",
    content: `## Summary
Price oracle can be manipulated using flash loans to extract value from the protocol.

## Vulnerability Detail
The oracle uses spot price from a single DEX without TWAP protection.

## Impact
Attackers can manipulate prices to liquidate positions unfairly or extract protocol funds.

## Recommendation
Implement TWAP oracle or use Chainlink price feeds.`,
    createdAt: "2024-11-21T14:20:00Z",
    updatedAt: "2024-11-21T14:20:00Z",
    authorId: "auditor-002",
  },
  {
    id: "finding-demo-003",
    contestId: "perpetual-dex",
    severity: "high",
    title: "Missing slippage protection in swaps",
    content: `## Summary
Swap functions lack slippage protection parameters.

## Vulnerability Detail
Users cannot specify minimum output amounts, exposing them to sandwich attacks.

## Impact
Users may receive significantly less tokens than expected due to MEV attacks.

## Recommendation
Add \`minAmountOut\` parameter to swap functions.`,
    createdAt: "2024-11-21T09:15:00Z",
    updatedAt: "2024-11-21T09:15:00Z",
    authorId: "auditor-003",
  },
  {
    id: "finding-demo-004",
    contestId: "perpetual-dex",
    severity: "high",
    title: "Incorrect fee calculation with rounding",
    content: `## Summary
Fee calculations round down, potentially losing significant value over many transactions.

## Vulnerability Detail
The fee is calculated as \`amount * feeRate / 10000\` which always rounds down in Solidity.

## Impact
Protocol loses fees on every transaction, compounding over time.

## Recommendation
Round up for protocol fees using \`(amount * feeRate + 9999) / 10000\`.`,
    createdAt: "2024-11-22T11:45:00Z",
    updatedAt: "2024-11-22T11:45:00Z",
    authorId: "auditor-001",
  },
  {
    id: "finding-demo-005",
    contestId: "perpetual-dex",
    severity: "medium",
    title: "Unbounded loop in position liquidation",
    content: `## Summary
Liquidation function iterates over all positions without gas limits.

## Vulnerability Detail
If a user has many positions, the liquidation transaction may run out of gas.

## Impact
Positions may become unliquidatable, creating bad debt for the protocol.

## Recommendation
Implement pagination or limit positions per user.`,
    createdAt: "2024-11-22T16:30:00Z",
    updatedAt: "2024-11-22T16:30:00Z",
    authorId: "auditor-004",
  },
  {
    id: "finding-demo-006",
    contestId: "perpetual-dex",
    severity: "medium",
    title: "Front-running vulnerability in order placement",
    content: `## Summary
Order placement can be front-run by MEV bots.

## Vulnerability Detail
Orders are visible in the mempool before execution.

## Impact
Users may get worse execution prices.

## Recommendation
Implement commit-reveal scheme or use private mempools.`,
    createdAt: "2024-11-23T08:00:00Z",
    updatedAt: "2024-11-23T08:00:00Z",
    authorId: "auditor-002",
  },
  {
    id: "finding-demo-007",
    contestId: "perpetual-dex",
    severity: "low",
    title: "Missing event emissions for state changes",
    content: `## Summary
Several state-changing functions don't emit events.

## Vulnerability Detail
Functions like \`updateFeeRate\` and \`setOracle\` don't emit events.

## Impact
Off-chain monitoring and indexing is incomplete.

## Recommendation
Add events for all admin functions and significant state changes.`,
    createdAt: "2024-11-23T10:20:00Z",
    updatedAt: "2024-11-23T10:20:00Z",
    authorId: "auditor-005",
  },
  {
    id: "finding-demo-008",
    contestId: "perpetual-dex",
    severity: "low",
    title: "Inconsistent error messages",
    content: `## Summary
Error messages are inconsistent and sometimes missing.

## Vulnerability Detail
Some require statements use custom errors, others use strings, some have no message.

## Impact
Poor developer experience and harder debugging.

## Recommendation
Use consistent custom errors throughout the codebase.`,
    createdAt: "2024-11-23T14:45:00Z",
    updatedAt: "2024-11-23T14:45:00Z",
    authorId: "auditor-003",
  },
  {
    id: "finding-demo-009",
    contestId: "perpetual-dex",
    severity: "informational",
    title: "Outdated Solidity version",
    content: `## Summary
Contract uses Solidity 0.8.17 instead of latest stable version.

## Recommendation
Update to Solidity 0.8.22 or later for latest optimizations and fixes.`,
    createdAt: "2024-11-24T09:00:00Z",
    updatedAt: "2024-11-24T09:00:00Z",
    authorId: "auditor-004",
  },
  {
    id: "finding-demo-010",
    contestId: "perpetual-dex",
    severity: "informational",
    title: "Missing NatSpec documentation",
    content: `## Summary
Many functions lack NatSpec documentation.

## Recommendation
Add comprehensive NatSpec comments for all public/external functions.`,
    createdAt: "2024-11-24T11:30:00Z",
    updatedAt: "2024-11-24T11:30:00Z",
    authorId: "auditor-001",
  },
];

// Seed mock data if not already seeded
const seedMockData = () => {
  const seeded = localStorage.getItem(SEEDED_KEY);
  if (!seeded) {
    const existing = localStorage.getItem(STORAGE_KEY);
    const existingFindings: Finding[] = existing ? JSON.parse(existing) : [];
    const merged = [...existingFindings, ...MOCK_FINDINGS];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    localStorage.setItem(SEEDED_KEY, "true");
  }
};

// Run seed on module load
seedMockData();

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
