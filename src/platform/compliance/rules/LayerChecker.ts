import { IComplianceRule, ComplianceViolation } from '../models';

export class LayerChecker implements IComplianceRule {
  name = 'LayerChecker';
  description = 'Ensures strict layering (e.g., Domain -> Infrastructure is forbidden)';

  check(filePath: string, content: string): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    const lines = content.split('\n');

    const isDomain = filePath.includes('/domain/');
    const isPresentation = filePath.includes('/presentation/') || filePath.includes('/routes/') || filePath.includes('/controllers/');
    const isApplication = filePath.includes('/application/') || filePath.includes('/usecases/');

    lines.forEach((line, index) => {
      // Domain -> Infrastructure
      if (isDomain && line.includes('import ') && line.includes('/infrastructure/')) {
        violations.push({
          file: filePath,
          rule: this.name,
          message: 'Domain layer cannot import from Infrastructure layer',
          line: index + 1
        });
      }
      // Presentation -> Repository (Direct access)
      if (isPresentation && line.includes('import ') && line.includes('Repository')) {
        violations.push({
          file: filePath,
          rule: this.name,
          message: 'Presentation layer cannot import Repositories directly',
          line: index + 1
        });
      }
      // Application -> Database (Direct access)
      if (isApplication && line.includes('import ') && (line.includes('db/') || line.includes('drizzle'))) {
        violations.push({
          file: filePath,
          rule: this.name,
          message: 'Application layer cannot access Database directly',
          line: index + 1
        });
      }
    });

    return violations;
  }
}
