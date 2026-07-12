const fs = require('fs');
let code = fs.readFileSync('src/pages/SettingsView.tsx', 'utf-8');

code = code.replace(
  /\['branch', 'division', 'department'\]\.includes\(activeTab\)/g,
  "['branch', 'division', 'department', 'section', 'team'].includes(activeTab)"
);

code = code.replace(
  /\{activeTab === 'department' && <DepartmentManager \/>\}/g,
  "{activeTab === 'department' && <DepartmentManager />}\n              {activeTab === 'section' && <SectionManager />}\n              {activeTab === 'team' && <TeamManager />}"
);

code = code.replace(
  /\['company', 'section', 'team', 'position', 'job_grade'\]\.includes\(activeTab\)/g,
  "['company', 'position', 'job_grade'].includes(activeTab)"
);

code = code.replace(
  /!\['company', 'branch', 'division', 'department', 'section', 'position', 'job_grade', 'setup_center'\]\.includes\(activeTab\)/g,
  "!['company', 'branch', 'division', 'department', 'section', 'team', 'position', 'job_grade', 'setup_center'].includes(activeTab)"
);

fs.writeFileSync('src/pages/SettingsView.tsx', code);
