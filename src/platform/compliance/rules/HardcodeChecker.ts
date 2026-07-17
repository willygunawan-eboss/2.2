import { IComplianceRule, ComplianceViolation } from '../models';

export class HardcodeChecker implements IComplianceRule {
  name = 'HardcodeChecker';
  description = 'Ensures no hardcoded workflow or policy names, and no console.log for audit';

  check(filePath: string, content: string): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('console.log') && (line.toLowerCase().includes('audit') || filePath.includes('Audit'))) {
        violations.push({
          file: filePath,
          rule: this.name,
          message: 'console.log cannot be used for Auditing',
          line: index + 1
        });
      }
      
      // Heuristic for hardcoded workflow names
      if ((line.includes('Workflow') || line.includes('Policy')) && line.match(/['"][A-Za-z0-9_]+['"]/)) {
        if (line.includes('execute') || line.includes('start')) {
           violations.push({
             file: filePath,
             rule: this.name,
             message: 'Avoid hardcoding Workflow or Policy names as strings',
             line: index + 1
           });
        }
      }
    });

    return violations;
  }
}
