const fs = require('fs');
let content = fs.readFileSync('src/pages/SettingsView.tsx', 'utf-8');

if (!content.includes('import { JobGradeManager }')) {
  content = content.replace("import TeamManager from '../components/TeamManager';", "import TeamManager from '../components/TeamManager';\nimport { JobGradeManager } from '../components/JobGradeManager';\nimport { PositionManager } from '../components/PositionManager';");
}

fs.writeFileSync('src/pages/SettingsView.tsx', content);
