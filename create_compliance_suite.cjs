const fs = require('fs');
const path = require('path');

const files = {
  'src/platform/compliance/models.ts': `
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
`,
  'src/platform/compliance/rules/LayerChecker.ts': `
import { IComplianceRule, ComplianceViolation } from '../models';

export class LayerChecker implements IComplianceRule {
  name = 'LayerChecker';
  description = 'Ensures strict layering (e.g., Domain -> Infrastructure is forbidden)';

  check(filePath: string, content: string): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    const lines = content.split('\\n');

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
`,
  'src/platform/compliance/rules/TypeSafetyChecker.ts': `
import { IComplianceRule, ComplianceViolation } from '../models';

export class TypeSafetyChecker implements IComplianceRule {
  name = 'TypeSafetyChecker';
  description = 'Ensures type safety, no Promise<any>';

  check(filePath: string, content: string): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    const lines = content.split('\\n');

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
`,
  'src/platform/compliance/rules/BusinessErrorChecker.ts': `
import { IComplianceRule, ComplianceViolation } from '../models';

export class BusinessErrorChecker implements IComplianceRule {
  name = 'BusinessErrorChecker';
  description = 'Ensures business errors use specific domain errors, not generic Error';

  check(filePath: string, content: string): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    const lines = content.split('\\n');
    
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
`,
  'src/platform/compliance/rules/HardcodeChecker.ts': `
import { IComplianceRule, ComplianceViolation } from '../models';

export class HardcodeChecker implements IComplianceRule {
  name = 'HardcodeChecker';
  description = 'Ensures no hardcoded workflow or policy names, and no console.log for audit';

  check(filePath: string, content: string): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    const lines = content.split('\\n');

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
`,
  'src/platform/compliance/rules/CircularDependencyChecker.ts': `
import { IComplianceRule, ComplianceViolation } from '../models';

export class CircularDependencyChecker implements IComplianceRule {
  name = 'CircularDependencyChecker';
  description = 'Checks for naive circular dependencies';

  check(filePath: string, content: string): ComplianceViolation[] {
    const violations: ComplianceViolation[] = [];
    // Full circular dependency detection requires a complete graph analysis.
    // This is a placeholder that can be extended with a tool like madge.
    return violations;
  }
}
`,
  'src/platform/compliance/ArchitectureReportGenerator.ts': `
import { ComplianceViolation } from './models';

export class ArchitectureReportGenerator {
  public generateReport(violations: ComplianceViolation[], scannedFiles: number): string {
    const score = Math.max(0, 100 - (violations.length * 2));
    
    let report = \`# Enterprise Architecture Compliance Report\\n\\n\`;
    report += \`## Architecture Health Score: \${score}/100\\n\\n\`;
    report += \`**Scanned Files:** \${scannedFiles}\\n\`;
    report += \`**Total Violations:** \${violations.length}\\n\\n\`;
    
    if (violations.length === 0) {
      report += \`✅ Architecture is clean. No violations found.\\n\`;
    } else {
      report += \`## Technical Debt & Violations\\n\\n\`;
      
      // Group by rule
      const byRule: Record<string, ComplianceViolation[]> = {};
      violations.forEach(v => {
        if (!byRule[v.rule]) byRule[v.rule] = [];
        byRule[v.rule].push(v);
      });
      
      for (const rule in byRule) {
        report += \`### \${rule}\\n\`;
        byRule[rule].forEach(v => {
          report += \`- **\${v.file}:\${v.line}** - \${v.message}\\n\`;
        });
        report += '\\n';
      }
    }
    
    return report;
  }
}
`,
  'src/platform/compliance/ArchitectureComplianceSuite.ts': `
import * as fs from 'fs';
import * as path from 'path';
import { IComplianceRule, ComplianceViolation } from './models';
import { LayerChecker } from './rules/LayerChecker';
import { TypeSafetyChecker } from './rules/TypeSafetyChecker';
import { BusinessErrorChecker } from './rules/BusinessErrorChecker';
import { HardcodeChecker } from './rules/HardcodeChecker';
import { CircularDependencyChecker } from './rules/CircularDependencyChecker';
import { ArchitectureReportGenerator } from './ArchitectureReportGenerator';

export class ArchitectureComplianceSuite {
  private rules: IComplianceRule[] = [];
  
  constructor() {
    this.rules.push(new LayerChecker());
    this.rules.push(new TypeSafetyChecker());
    this.rules.push(new BusinessErrorChecker());
    this.rules.push(new HardcodeChecker());
    this.rules.push(new CircularDependencyChecker());
  }

  public run(directory: string): string {
    const files = this.getAllTypeScriptFiles(directory);
    let allViolations: ComplianceViolation[] = [];
    
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      for (const rule of this.rules) {
        const violations = rule.check(file, content);
        allViolations = allViolations.concat(violations);
      }
    }
    
    const generator = new ArchitectureReportGenerator();
    return generator.generateReport(allViolations, files.length);
  }
  
  private getAllTypeScriptFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    if (!fs.existsSync(dirPath)) return arrayOfFiles;
    
    const files = fs.readdirSync(dirPath);
    
    files.forEach((file) => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        if (!fullPath.includes('node_modules') && !fullPath.includes('dist')) {
          arrayOfFiles = this.getAllTypeScriptFiles(fullPath, arrayOfFiles);
        }
      } else {
        if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
          arrayOfFiles.push(fullPath);
        }
      }
    });
    
    return arrayOfFiles;
  }
}
`,
  'src/platform/compliance/run_compliance.ts': `
import { ArchitectureComplianceSuite } from './ArchitectureComplianceSuite';
import * as path from 'path';
import * as fs from 'fs';

const suite = new ArchitectureComplianceSuite();
const projectRoot = path.join(process.cwd(), 'src');
const report = suite.run(projectRoot);

console.log(report);
fs.writeFileSync(path.join(process.cwd(), 'ArchitectureComplianceReport.md'), report);
console.log('Report saved to ArchitectureComplianceReport.md');
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content.trim() + '\n');
}
console.log('Architecture Compliance Suite files created successfully');
