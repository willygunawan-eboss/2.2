const fs = require('fs');
let content = fs.readFileSync('src/routes/orgRoutes.ts', 'utf8');

content = content.replace(
  "schema.departments,\n        sections, departmentSchema",
  "schema.departments, departmentSchema"
);

fs.writeFileSync('src/routes/orgRoutes.ts', content);
