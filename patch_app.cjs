const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

if (!content.includes('OrgWorkspaceView')) {
  content = content.replace("import { SettingsView } from './pages/SettingsView';", "import { SettingsView } from './pages/SettingsView';\nimport { OrgWorkspaceView } from './pages/OrgWorkspaceView';");
  
  content = content.replace("case 'hr': return <HRView />;", "case 'hr': return <HRView />;\n      case 'org_workspace': return <OrgWorkspaceView />;\n");
  
  fs.writeFileSync('src/App.tsx', content);
}
