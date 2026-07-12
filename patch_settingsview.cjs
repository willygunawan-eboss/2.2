const fs = require('fs');
let content = fs.readFileSync('src/pages/SettingsView.tsx', 'utf-8');

// Add imports
if (!content.includes('JobGradeManager')) {
  content = content.replace("import { TeamManager } from '../components/TeamManager';", "import { TeamManager } from '../components/TeamManager';\nimport { JobGradeManager } from '../components/JobGradeManager';\nimport { PositionManager } from '../components/PositionManager';");
}

content = content.replace("{['branch', 'division', 'department', 'section', 'team'].includes(activeTab) ?", "{['branch', 'division', 'department', 'section', 'team', 'position', 'job_grade'].includes(activeTab) ?");

content = content.replace("{activeTab === 'team' && <TeamManager />}", "{activeTab === 'team' && <TeamManager />}\n              {activeTab === 'position' && <PositionManager />}\n              {activeTab === 'job_grade' && <JobGradeManager />}");

content = content.replace("{['company', 'position', 'job_grade'].includes(activeTab) && <OrgMasterView defaultTab={activeTab} />}", "{['company'].includes(activeTab) && <OrgMasterView defaultTab={activeTab} />}");

fs.writeFileSync('src/pages/SettingsView.tsx', content);
