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
