const fs = require('fs');
let content = fs.readFileSync('src/pages/DashboardView.tsx', 'utf8');

// I also need to make sure Building2 is imported
if (!content.includes('Building2')) {
  content = content.replace('import { LayoutGrid', 'import { Building2, LayoutGrid');
}

// In the onClick handler for the quick links, it's currently hardcoded:
// if (link.name.includes("Employee") || link.name === "My Info") onNavigate("hr"); else if (link.name === "ERP Setup Center") onNavigate("setup_center"); else onNavigate("settings");
content = content.replace(
  'if (link.name.includes("Employee") || link.name === "My Info") onNavigate("hr"); else if (link.name === "ERP Setup Center") onNavigate("setup_center"); else onNavigate("settings");',
  'if (link.nav) onNavigate(link.nav); else if (link.name.includes("Employee") || link.name === "My Info") onNavigate("hr"); else if (link.name === "ERP Setup Center") onNavigate("setup_center"); else onNavigate("settings");'
);

fs.writeFileSync('src/pages/DashboardView.tsx', content);
console.log("Fixed dashboard nav");
