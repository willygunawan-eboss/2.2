const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const debugCode = `
      console.log('1. Company');
      let compId = '';
      const existingComp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      if (existingComp.length > 0) {
        compId = existingComp[0].id;
      } else {
        compId = crypto.randomUUID();
        await db.insert(schema.companies).values({ id: compId, name: companyName, code: 'COMP-01' });
      }
      
      console.log('2. Branch');
      let branchId = '';
      const existingBranch = await db.select({ id: schema.branches.id }).from(schema.branches).where(eq(schema.branches.companyId, compId)).limit(1);
      if (existingBranch.length > 0) {
        branchId = existingBranch[0].id;
      } else {
        branchId = crypto.randomUUID();
        await db.insert(schema.branches).values({ id: branchId, companyId: compId, name: 'Main Branch', code: 'HQ' });
      }

      console.log('3. Division');
      let divId = '';
      const existingDiv = await db.select({ id: schema.divisions.id }).from(schema.divisions).where(eq(schema.divisions.companyId, compId)).limit(1);
      if (existingDiv.length > 0) {
        divId = existingDiv[0].id;
      } else {
        divId = crypto.randomUUID();
        await db.insert(schema.divisions).values({ id: divId, companyId: compId, name: 'Main Division', code: 'DIV-01' });
      }

      console.log('4. Department');
      let deptId = '';
      const existingDept = await db.select({ id: schema.departments.id }).from(schema.departments).where(eq(schema.departments.divisionId, divId)).limit(1);
      if (existingDept.length > 0) {
        deptId = existingDept[0].id;
      } else {
        deptId = crypto.randomUUID();
        await db.insert(schema.departments).values({ id: deptId, divisionId: divId, name: 'Management', code: 'MGT' });
      }

      console.log('Job Grade');
      let jgId = '';
      const existingJG = await db.select({ id: schema.jobGrades.id }).from(schema.jobGrades).limit(1);
      if (existingJG.length > 0) {
        jgId = existingJG[0].id;
      } else {
        jgId = crypto.randomUUID();
        await db.insert(schema.jobGrades).values({ id: jgId, code: 'JG-1', name: 'Staff', level: 1 });
      }

      console.log('5. Position');
      let posId = '';
      const existingPos = await db.select({ id: schema.positions.id }).from(schema.positions).where(eq(schema.positions.code, 'POS-DIR')).limit(1);
      if (existingPos.length > 0) {
        posId = existingPos[0].id;
      } else {
        posId = crypto.randomUUID();
        await db.insert(schema.positions).values({ id: posId, departmentId: deptId, jobGradeId: jgId, code: 'POS-DIR', name: 'Director' });
      }

      console.log('Admin User');
      const adminUsers = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.username, 'admin')).limit(1);
      let adminUserId = '';
      if (adminUsers.length > 0) {
        adminUserId = adminUsers[0].id;
        if (adminPassword) {
           const passwordHash = await bcrypt.hash(adminPassword, 10);
           await db.update(schema.users).set({ passwordHash }).where(eq(schema.users.id, adminUserId));
        }
      }

      console.log('6. Employee');
      const existingEmp = await db.select({ id: schema.employees.id }).from(schema.employees).where(eq(schema.employees.employeeNumber, 'EMP-0001')).limit(1);
      if (existingEmp.length === 0 && adminUserId) {
        await db.insert(schema.employees).values({
          id: crypto.randomUUID(),
          employeeNumber: 'EMP-0001',
          name: 'Administrator',
          email: 'admin@ichangeboss.com',
          companyId: compId,
          branchId: branchId,
          departmentId: deptId,
          positionId: posId,
          status: 'Active'
        });
      }
      console.log('Done');
`;

const prefix = content.split('// 1. Company')[0];
const suffixMatch = content.match(/res\.json\(\{ success: true, status: 'bootstrapCompleted' \}\);/);

fs.writeFileSync('server.ts', prefix + debugCode + suffixMatch[0] + `
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: String(e) });
    }
  });`);
console.log('patched 6');
