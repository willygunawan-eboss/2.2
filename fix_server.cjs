const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The block to replace:
/*
      let divId = '';
      const existingDiv = await db.select({ id: schema.divisions.id }).from(schema.divisions).where(eq(schema.divisions.companyId, compId)).limit(1);
...
        await db.insert(schema.positions).values({ id: posId, departmentId: deptId, sectionId: sectId, jobGradeId: jgId, code: 'POS-DIR', name: 'Director' });
      }
*/

const replacement = `      let branchId = '';
      const existingBranch = await db.select({ id: schema.branches.id }).from(schema.branches).where(eq(schema.branches.companyId, compId)).limit(1);
      if (existingBranch.length > 0) {
        branchId = existingBranch[0].id;
      } else {
        branchId = crypto.randomUUID();
        await db.insert(schema.branches).values({ id: branchId, companyId: compId, name: 'Main Branch', code: 'BR-01' });
      }

      let divId = '';
      const existingDiv = await db.select({ id: schema.divisions.id }).from(schema.divisions).where(eq(schema.divisions.companyId, compId)).limit(1);
      if (existingDiv.length > 0) {
        divId = existingDiv[0].id;
      } else {
        divId = crypto.randomUUID();
        await db.insert(schema.divisions).values({ id: divId, companyId: compId, branchId: branchId, name: 'Main Division', code: 'DIV-01' });
      }

      let deptId = '';
      const existingDept = await db.select({ id: schema.departments.id }).from(schema.departments).where(eq(schema.departments.divisionId, divId)).limit(1);
      if (existingDept.length > 0) {
        deptId = existingDept[0].id;
      } else {
        deptId = crypto.randomUUID();
        await db.insert(schema.departments).values({ id: deptId, companyId: compId, branchId: branchId, divisionId: divId, name: 'Management', code: 'MGT' });
      }

      let sectId = '';
      const existingSect = await db.select({ id: schema.sections.id }).from(schema.sections).where(eq(schema.sections.departmentId, deptId)).limit(1);
      if (existingSect.length > 0) {
        sectId = existingSect[0].id;
      } else {
        sectId = crypto.randomUUID();
        await db.insert(schema.sections).values({ id: sectId, companyId: compId, branchId: branchId, divisionId: divId, departmentId: deptId, name: 'General Section', code: 'SEC-GEN' });
      }

      let jgId = '';
      const existingJG = await db.select({ id: schema.jobGrades.id }).from(schema.jobGrades).limit(1);
      if (existingJG.length > 0) {
        jgId = existingJG[0].id;
      } else {
        jgId = crypto.randomUUID();
        await db.insert(schema.jobGrades).values({ id: jgId, code: 'JG-1', name: 'Staff', level: 1 });
      }

      let posId = '';
      const existingPos = await db.select({ id: schema.positions.id }).from(schema.positions).where(eq(schema.positions.code, 'POS-DIR')).limit(1);
      if (existingPos.length > 0) {
        posId = existingPos[0].id;
      } else {
        posId = crypto.randomUUID();
        await db.insert(schema.positions).values({ id: posId, companyId: compId, branchId: branchId, divisionId: divId, departmentId: deptId, sectionId: sectId, jobGradeId: jgId, code: 'POS-DIR', name: 'Director' });
      }`;

content = content.replace(
  /let divId = '';[\s\S]*?name: 'Director' \}\);\n      \}/,
  replacement
);

fs.writeFileSync('server.ts', content);
