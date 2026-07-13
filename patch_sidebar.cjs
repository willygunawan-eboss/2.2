const fs = require('fs');
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');

if (!content.includes("id: 'org_workspace'")) {
  content = content.replace(
    "{ id: 'hr', label: 'HR & Payroll', icon: Users, hasSubmenu: true },",
    "{ id: 'org_workspace', label: 'Organization Workspace', icon: Users },\n  { id: 'hr', label: 'HR & Payroll', icon: Users, hasSubmenu: true },"
  );
  
  // also add icon import if missing
  if (!content.includes('Network')) {
    content = content.replace('import { LayoutDashboard, Users,', 'import { LayoutDashboard, Users, Network,');
    content = content.replace("icon: Users },", "icon: Network },");
  }
  
  fs.writeFileSync('src/components/Sidebar.tsx', content);
}
