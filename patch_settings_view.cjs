const fs = require('fs');
let code = fs.readFileSync('src/pages/SettingsView.tsx', 'utf-8');

if (!code.includes('import SectionManager')) {
  code = code.replace(/import DepartmentManager from '\.\.\/components\/DepartmentManager';/, "import DepartmentManager from '../components/DepartmentManager';\nimport SectionManager from '../components/SectionManager';\nimport TeamManager from '../components/TeamManager';");
}

if (!code.includes("{ id: 'sections', label: 'Sections', icon: LayoutDashboard }")) {
  code = code.replace(
    /{ id: 'departments', label: 'Departments', icon: Building2 },/g,
    "{ id: 'departments', label: 'Departments', icon: Building2 },\n    { id: 'sections', label: 'Sections', icon: LayoutDashboard },\n    { id: 'teams', label: 'Teams', icon: LayoutDashboard },"
  );
}

if (!code.includes("activeTab === 'sections' && <SectionManager />")) {
  code = code.replace(
    /activeTab === 'departments' && <DepartmentManager \/>}/g,
    "activeTab === 'departments' && <DepartmentManager />}\n          {activeTab === 'sections' && <SectionManager />}\n          {activeTab === 'teams' && <TeamManager />}"
  );
}

fs.writeFileSync('src/pages/SettingsView.tsx', code);
