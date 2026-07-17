const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('import { EmpWorkspaceView }')) {
  content = content.replace(
    "import { OrgWorkspaceView } from './pages/OrgWorkspaceView';",
    "import { OrgWorkspaceView } from './pages/OrgWorkspaceView';\nimport { EmpWorkspaceView } from './pages/EmpWorkspaceView';"
  );
}

if (!content.includes("case 'emp_workspace':")) {
  content = content.replace(
    "case 'org_workspace': return <OrgWorkspaceView />;",
    "case 'org_workspace': return <OrgWorkspaceView />;\n      case 'emp_workspace': return <EmpWorkspaceView />;"
  );
}

fs.writeFileSync('src/App.tsx', content);
