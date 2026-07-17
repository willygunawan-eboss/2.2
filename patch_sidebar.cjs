const fs = require('fs');
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

if (!content.includes("id: 'emp_workspace'")) {
  content = content.replace(
    "{ id: 'org_workspace', label: 'Organization Workspace', icon: Network },",
    "{ id: 'org_workspace', label: 'Organization Workspace', icon: Network },\n  { id: 'emp_workspace', label: 'Employment Workspace', icon: Briefcase },"
  );
}

fs.writeFileSync('src/components/Sidebar.tsx', content);
