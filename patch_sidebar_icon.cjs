const fs = require('fs');
let content = fs.readFileSync('src/components/Sidebar.tsx', 'utf8');

content = content.replace("import { LayoutDashboard, Users, Network, ShoppingCart, Briefcase, CreditCard, Box, MoreHorizontal, ChevronRight, Settings, FileText, Database, HeadphonesIcon, BarChart3, BookOpen, Wrench, FileArchive, Calculator } from 'lucide-react';",
"import { LayoutDashboard, Users, Network, ShoppingCart, Briefcase, CreditCard, Box, MoreHorizontal, ChevronRight, Settings, FileText, Database, HeadphonesIcon, BarChart3, BookOpen, Wrench, FileArchive, Calculator, UserCheck } from 'lucide-react';");

content = content.replace(
  "{ id: 'emp_workspace', label: 'Employment Workspace', icon: Briefcase },",
  "{ id: 'emp_workspace', label: 'Employment Workspace', icon: UserCheck },"
);

fs.writeFileSync('src/components/Sidebar.tsx', content);
