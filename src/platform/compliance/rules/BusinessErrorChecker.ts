import { IComplianceRule, ComplianceViolation } from '../models';

export class BusinessErrorChecker implements IComplianceRule {
  name = 'BusinessErrorChecker';
  description = 'Ensures business errors use specific domain errors, not generic Error';

  check(filePath: string, content: string): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    const lines = content.split('\n');
    
    // Simplistic check for 'throw new Error('
    lines.forEach((line, index) => {
      if (line.includes('throw new Error(')) {
        violations.push({
          file: filePath,
          rule: this.name,
          message: 'Throwing generic Error is forbidden. Use specific Domain Errors.',
          line: index + 1
        });
      }
    });

    return violations;
  }
}
