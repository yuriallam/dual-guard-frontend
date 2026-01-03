
export enum SeverityEnum {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export const severityOrder: Record<SeverityEnum, number> = {
  [SeverityEnum.HIGH]: 0,
  [SeverityEnum.MEDIUM]: 1,
  [SeverityEnum.LOW]: 2,
};

export const severityLabels: Record<SeverityEnum, string> = {
  [SeverityEnum.HIGH]: "High",
  [SeverityEnum.MEDIUM]: "Medium",
  [SeverityEnum.LOW]: "Low",
};

export const severityColors: Record<SeverityEnum, string> = {
  [SeverityEnum.HIGH]: "bg-destructive/10 text-destructive border-destructive/30",
  [SeverityEnum.MEDIUM]: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  [SeverityEnum.LOW]: "bg-blue-500/10 text-blue-500 border-blue-500/30",
};
