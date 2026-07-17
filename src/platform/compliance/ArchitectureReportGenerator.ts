import { ComplianceViolation } from './models';

export class ArchitectureReportGenerator {
  public generateReport(violations: ComplianceViolation[], scannedFiles: number): string {
    const score = Math.max(0, 100 - (violations.length * 2));
    
    let report = `# Enterprise Architecture Compliance Report\n\n`;
    report += `## Architecture Health Score: ${score}/100\n\n`;
    report += `**Scanned Files:** ${scannedFiles}\n`;
    report += `**Total Violations:** ${violations.length}\n\n`;
    
    if (violations.length === 0) {
      report += `✅ Architecture is clean. No violations found.\n`;
    } else {
      report += `## Technical Debt & Violations\n\n`;
      
      // Group by rule
      const byRule: Record<string, ComplianceViolation[]> = {};
      violations.forEach(v => {
        if (!byRule[v.rule]) byRule[v.rule] = [];
        byRule[v.rule].push(v);
      });
      
      for (const rule in byRule) {
        report += `### ${rule}\n`;
        byRule[rule].forEach(v => {
          report += `- **${v.file}:${v.line}** - ${v.message}\n`;
        });
        report += '\n';
      }
    }
    
    return report;
  }
}
