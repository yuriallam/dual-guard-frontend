export type Protocol = 'DeFi' | 'NFT' | 'Gaming' | 'DAO' | 'Bridge' | 'Oracle';
export type Language = 'Solidity' | 'Rust' | 'Move' | 'Cairo' | 'Vyper';

export interface Auditor {
  id: string;
  username: string;
  avatar: string;
  rank: number;
  highFindings: number;
  soloHighFindings: number;
  mediumFindings: number;
  soloMediumFindings: number;
  lowFindings: number;
  soloLowFindings: number;
  daysOfAuditing: number;
  totalEarnings: string;
  points: number;
  winRate: number;
  conversionRate: number;
  accuracyRate: number;
  protocols: Protocol[];
  languages: Language[];
}

export const allProtocols: Protocol[] = ['DeFi', 'NFT', 'Gaming', 'DAO', 'Bridge', 'Oracle'];
export const allLanguages: Language[] = ['Solidity', 'Rust', 'Move', 'Cairo', 'Vyper'];
