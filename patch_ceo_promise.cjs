const fs = require('fs');
let content = fs.readFileSync('src/components/OrgWorkspace/CEOView.tsx', 'utf-8');

if (!content.includes("fetch('/api/organization/platform/health').then")) {
  content = content.replace(
    "fetch('/api/organization/workspace/readiness').then(res => res.json()),",
    "fetch('/api/organization/workspace/readiness').then(res => res.json()),\n      fetch('/api/organization/platform/health').then(res => res.json()),"
  );
  fs.writeFileSync('src/components/OrgWorkspace/CEOView.tsx', content);
}
