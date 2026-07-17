const fs = require('fs');
const file = 'src/pages/OrgMasterView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `case 'employees': return ['employeeNumber', 'name', 'email', 'positionId', 'status'];`,
  `case 'employees': return ['employeeNumber', 'name', 'email', 'status'];`
);

code = code.replace(
  `if (c === 'positionId') val = references.positions?.find((x:any) => x.id === val)?.name || val;`,
  `// position mapping removed`
);

code = code.replace(
  `if (c === 'positionId') opts = references.positions || [];`,
  `// position opts removed`
);

fs.writeFileSync(file, code);
