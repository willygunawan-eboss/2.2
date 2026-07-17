const fs = require('fs');
let content = fs.readFileSync('src/types.ts', 'utf8');

content = content.replace(
  "| 'settings' | 'org_workspace'",
  "| 'settings' | 'org_workspace' | 'emp_workspace'"
);

fs.writeFileSync('src/types.ts', content);
