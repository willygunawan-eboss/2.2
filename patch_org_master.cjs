const fs = require('fs');
let code = fs.readFileSync('src/pages/OrgMasterView.tsx', 'utf-8');

code = code.replace(/\{ id: 'division', label: 'Divisions', icon: Building2 \},/, '');
code = code.replace(/\{ id: 'department', label: 'Departments', icon: Users \},/, '');

fs.writeFileSync('src/pages/OrgMasterView.tsx', code);
