export interface ComplianceViolation {
  file: string;
  rule: string;
  message: string;
  line: number;
}

export interface IComplianceRule {
  name: string;
  description: string;
  check(filePath: string, content: string): ComplianceViolation[];
}
