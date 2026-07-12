const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldEmployeeInsert = `await db.insert(schema.employees).values({
          id: crypto.randomUUID(),
          employeeNumber: 'EMP-0001',
          name: 'Administrator',
          email: 'admin@ichangeboss.com',
          companyId: compId,
          branchId: branchId,
          departmentId: deptId,
          positionId: posId,
          status: 'Active'
        });`;

const newEmployeeInsert = `
        const empId = crypto.randomUUID();
        const sqlQuery = require('drizzle-orm').sql\`INSERT INTO employees (id, employee_number, name, email, company_id, branch_id, department_id, position_id, status) VALUES (\${empId}, 'EMP-0001', 'Administrator', 'admin@ichangeboss.com', \${compId}, \${branchId}, \${deptId}, \${posId}, 'Active')\`;
        await db.run(sqlQuery);
`;

content = content.replace(oldEmployeeInsert, newEmployeeInsert);
fs.writeFileSync('server.ts', content);
console.log('patched 7');
