const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// The git checkout restored the old GET /api/bootstrap/status.
// We need to replace it with the new GET and POST logic!

const replacement = `
  app.get("/api/bootstrap/status", async (req, res) => {
    try {
      const companies = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      const isSystemReady = companies.length > 0;
      res.json({ 
        success: true,
        status: isSystemReady ? 'bootstrapCompleted' : 'bootstrapRequired'
      });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  app.post("/api/bootstrap", async (req, res) => {
    try {
      const { companyName, adminPassword } = req.body;
      if (!companyName) return res.status(400).json({ success: false, message: 'companyName required' });
      
      let compId = '';
      const existingComp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      if (existingComp.length > 0) {
        compId = existingComp[0].id;
      } else {
        compId = crypto.randomUUID();
        await db.insert(schema.companies).values({ id: compId, name: companyName, code: 'COMP-01' });
      }
      
      let branchId = '';
      const existingBranch = await db.select({ id: schema.branches.id }).from(schema.branches).where(eq(schema.branches.companyId, compId)).limit(1);
      if (existingBranch.length > 0) {
        branchId = existingBranch[0].id;
      } else {
        branchId = crypto.randomUUID();
        await db.insert(schema.branches).values({ id: branchId, companyId: compId, name: 'Main Branch', code: 'HQ' });
      }

      let divId = '';
      const existingDiv = await db.select({ id: schema.divisions.id }).from(schema.divisions).where(eq(schema.divisions.companyId, compId)).limit(1);
      if (existingDiv.length > 0) {
        divId = existingDiv[0].id;
      } else {
        divId = crypto.randomUUID();
        await db.insert(schema.divisions).values({ id: divId, companyId: compId, name: 'Main Division', code: 'DIV-01' });
      }

      let deptId = '';
      const existingDept = await db.select({ id: schema.departments.id }).from(schema.departments).where(eq(schema.departments.divisionId, divId)).limit(1);
      if (existingDept.length > 0) {
        deptId = existingDept[0].id;
      } else {
        deptId = crypto.randomUUID();
        await db.insert(schema.departments).values({ id: deptId, divisionId: divId, name: 'Management', code: 'MGT' });
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
        await db.insert(schema.positions).values({ id: posId, departmentId: deptId, jobGradeId: jgId, code: 'POS-DIR', name: 'Director' });
      }

      const adminUsers = await db.select({ id: schema.users.id }).from(schema.users).where(eq(schema.users.username, 'admin')).limit(1);
      let adminUserId = '';
      if (adminUsers.length > 0) {
        adminUserId = adminUsers[0].id;
        if (adminPassword) {
           const passwordHash = await require('bcryptjs').hash(adminPassword, 10);
           await db.update(schema.users).set({ passwordHash }).where(eq(schema.users.id, adminUserId));
        }
      }

      const existingEmp = await db.select({ id: schema.employees.id }).from(schema.employees).where(eq(schema.employees.employeeNumber, 'EMP-0001')).limit(1);
      if (existingEmp.length === 0 && adminUserId) {
        const empId = crypto.randomUUID();
        const sqlQuery = sql\`INSERT INTO employees (id, employee_number, name, email, company_id, branch_id, department_id, position_id, status) VALUES (\${empId}, 'EMP-0001', 'Administrator', 'admin@ichangeboss.com', \${compId}, \${branchId}, \${deptId}, \${posId}, 'Active')\`;
        await db.run(sqlQuery);
      }

      res.json({ success: true, status: 'bootstrapCompleted' });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, error: String(e) });
    }
  });
`;

const oldStatusApiRegex = /app\.get\("\/api\/bootstrap\/status", async \(req, res\) => \{[\s\S]*?\}\);/g;
content = content.replace(oldStatusApiRegex, replacement);

fs.writeFileSync('server.ts', content);
console.log('patched 9');
