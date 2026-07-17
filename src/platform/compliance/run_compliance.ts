import { ArchitectureComplianceSuite } from './ArchitectureComplianceSuite';
import * as path from 'path';
import * as fs from 'fs';

const suite = new ArchitectureComplianceSuite();
const projectRoot = path.join(process.cwd(), 'src');
const report = suite.run(projectRoot);

console.log(report);
fs.writeFileSync(path.join(process.cwd(), 'ArchitectureComplianceReport.md'), report);
console.log('Report saved to ArchitectureComplianceReport.md');
