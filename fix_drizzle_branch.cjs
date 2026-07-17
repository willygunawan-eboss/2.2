const fs = require('fs');

let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// I removed supervisorEmployeeId and managerEmployeeId, let's make sure I didn't leave a relation breaking everything.
// Look for one(employees ... for manager/supervisor in employees relation
code = code.replace(
  /branchId: text\("branch_id"\)\.references\(\(\) => branches\.id\),/g, ''
);

fs.writeFileSync(file, code);

