const fs = require('fs');
let content = fs.readFileSync('src/pages/OrgMasterView.tsx', 'utf8');

content = content.replace(
  "const endpointMap: any = { 'job_grade': 'job-grades', 'branch': 'branches', 'division': 'divisions', 'department': 'departments', 'section': 'sections', 'position': 'positions', 'employee': 'employees', 'company': 'company' };",
  ""
);

content = content.replace(
  "export function OrgMasterView({ defaultTab }: { defaultTab?: string }) {\n  const activeTab = defaultTab || 'company';",
  "export function OrgMasterView({ defaultTab }: { defaultTab?: string }) {\n  const activeTab = defaultTab || 'company';\n  const endpointMap: any = { 'job_grade': 'job-grades', 'branch': 'branches', 'division': 'divisions', 'department': 'departments', 'section': 'sections', 'position': 'positions', 'employee': 'employees', 'company': 'companies' };"
);

fs.writeFileSync('src/pages/OrgMasterView.tsx', content);
