const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldDept = `const deptId = crypto.randomUUID();
      await db.insert(schema.departments).values({
        id: deptId,
        branchId: branchId,
        name: 'Management',
        code: 'MGT'
      });`;

const newDept = `const divId = crypto.randomUUID();
      await db.insert(schema.divisions).values({
        id: divId,
        companyId: compId,
        name: 'Main Division',
        code: 'DIV-01'
      });

      const deptId = crypto.randomUUID();
      await db.insert(schema.departments).values({
        id: deptId,
        divisionId: divId,
        name: 'Management',
        code: 'MGT'
      });`;

content = content.replace(oldDept, newDept);
fs.writeFileSync('server.ts', content);
console.log('patched');
