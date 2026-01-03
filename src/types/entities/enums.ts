// Enum types matching backend schema
export type UserRole = 'AUDITOR' | 'JUDGE' | 'ADMIN';
export type UserStatus = 'UNVERIFIED' | 'VERIFIED' | 'SUSPENDED' | 'BANNED';
export type ContestStatus = 'DRAFT' | 'ACTIVE' | 'JUDGING' | 'ESCALATIONS' | 'COMPLETED' | 'CANCELLED';
export type IssueStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'DUPLICATE' | 'ESCALATED';
export type Severity =  'high' | 'medium' | 'low' ;

