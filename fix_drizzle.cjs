const fs = require('fs');

let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// I removed supervisorEmployeeId and managerEmployeeId, let's make sure I didn't leave a relation breaking everything.
// Look for one(employees ... for manager/supervisor in employees relation
code = code.replace(
  /manager: one\(employees, \{[\s\S]*?\}\),/g, ''
);
code = code.replace(
  /supervisor: one\(employees, \{[\s\S]*?\}\),/g, ''
);
code = code.replace(
  /manager: one\(empPlatform, \{ fields: \[empAssignment.managerId\], references: \[empPlatform.id\], relationName: "assignment_manager" \}\),/g, ''
);
code = code.replace(
  /supervisor: one\(empPlatform, \{ fields: \[empAssignment.supervisorId\], references: \[empPlatform.id\], relationName: "assignment_supervisor" \}\),/g, ''
);

fs.writeFileSync(file, code);

