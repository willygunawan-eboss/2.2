import { IComplianceRule, ComplianceViolation } from '../models';

export class TypeSafetyChecker implements IComplianceRule {
  name = 'TypeSafetyChecker';
  description = 'Ensures type safety, no Promise<any>';

  check(filePath: string, content: string): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('Promise<any>')) {
        violations.push({
          file: filePath,
          rule: this.name,
          message: 'Usage of Promise<any> is forbidden',
          line: index + 1
        });
      }
    });

    return violations;
  }
}
