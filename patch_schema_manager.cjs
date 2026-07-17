const fs = require('fs');
const file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/  manager: one\(employees, \{ fields: \[employees\.managerEmployeeId\], references: \[employees\.id\], relationName: "manager" \}\),\n/g, "");
code = code.replace(/  supervisor: one\(employees, \{ fields: \[employees\.supervisorEmployeeId\], references: \[employees\.id\], relationName: "supervisor" \}\),\n/g, "");

fs.writeFileSync(file, code);
