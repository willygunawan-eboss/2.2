const fs = require('fs');
let content = fs.readFileSync('src/pages/OrgMasterView.tsx', 'utf8');

content = content.replace(
  "export function OrgMasterView() {\n  const [activeTab, setActiveTab] = useState('company');",
  "export function OrgMasterView({ defaultTab }: { defaultTab?: string }) {\n  const activeTab = defaultTab || 'company';"
);

// Remove the internal tabs UI
content = content.replace(
  /<div className="border-b border-slate-100 p-2">[\s\S]*?<\/div>\s*<div className="flex-1/m,
  '<div className="flex-1'
);

// We need to map `defaultTab` from 'section' to 'sections', 'job_grade' to 'job-grades' etc.
content = content.replace(
  "<GenericCrud endpoint={activeTab} />",
  "const endpointMap: any = { 'job_grade': 'job-grades', 'branch': 'branches', 'division': 'divisions', 'department': 'departments', 'section': 'sections', 'position': 'positions', 'employee': 'employees', 'company': 'company' };\n        <GenericCrud endpoint={endpointMap[activeTab] || activeTab} />"
);

fs.writeFileSync('src/pages/OrgMasterView.tsx', content);
