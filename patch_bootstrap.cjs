const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const sectionLogic = `
      let sectId = '';
      const existingSect = await db.select({ id: schema.sections.id }).from(schema.sections).where(eq(schema.sections.departmentId, deptId)).limit(1);
      if (existingSect.length > 0) {
        sectId = existingSect[0].id;
      } else {
        sectId = crypto.randomUUID();
        await db.insert(schema.sections).values({ id: sectId, departmentId: deptId, name: 'General Section', code: 'SEC-GEN' });
      }
`;

content = content.replace(
  "      let jgId = '';\n      const existingJG = await db.select({ id: schema.jobGrades.id }).from(schema.jobGrades).limit(1);",
  sectionLogic + "\n      let jgId = '';\n      const existingJG = await db.select({ id: schema.jobGrades.id }).from(schema.jobGrades).limit(1);"
);

content = content.replace(
  "await db.insert(schema.positions).values({ id: posId, departmentId: deptId, jobGradeId: jgId, code: 'POS-DIR', name: 'Director' });",
  "await db.insert(schema.positions).values({ id: posId, departmentId: deptId, sectionId: sectId, jobGradeId: jgId, code: 'POS-DIR', name: 'Director' });"
);

content = content.replace(
  "const sqlQuery = sql\`INSERT INTO employees (id, employee_number, name, email, company_id, branch_id, department_id, position_id, status) VALUES (${empId}, 'EMP-0001', 'Administrator', 'admin@ichangeboss.com', ${compId}, ${branchId}, ${deptId}, ${posId}, 'Active')\`;",
  "const sqlQuery = sql\`INSERT INTO employees (id, employee_number, name, email, company_id, branch_id, department_id, section_id, position_id, status) VALUES (${empId}, 'EMP-0001', 'Administrator', 'admin@ichangeboss.com', ${compId}, ${branchId}, ${deptId}, ${sectId}, ${posId}, 'Active')\`;"
);

fs.writeFileSync('server.ts', content);
