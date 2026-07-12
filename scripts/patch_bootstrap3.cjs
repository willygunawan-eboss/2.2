const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const prefix = content.split('app.post("/api/bootstrap", async (req, res) => {')[0];
const suffixMatch = content.match(/res\.json\(\{ success: true, status: 'bootstrapCompleted' \}\);\n\s*\} catch \(e\) \{\n\s*res\.status\(500\)\.json\(\{ success: false, error: String\(e\) \}\);\n\s*\}\n\s*\}\);([\s\S]*)/);

if (!suffixMatch) {
  console.error("Could not find suffix");
  process.exit(1);
}

const newPost = `app.post("/api/bootstrap", async (req, res) => {
    try {
      const { companyName, adminPassword } = req.body;
      if (!companyName) return res.status(400).json({ success: false, message: 'companyName required' });
      
      // 1. Company
      let compId = '';
      const existingComp = await db.select().from(schema.companies).limit(1);
      if (existingComp.length > 0) {
        compId = existingComp[0].id;
      } else {
        compId = crypto.randomUUID();
        await db.insert(schema.companies).values({
          id: compId,
          name: companyName,
          code: 'COMP-01'
        });
      }
      
      // 2. Branch
      let branchId = '';
      const existingBranch = await db.select().from(schema.branches).where(eq(schema.branches.companyId, compId)).limit(1);
      if (existingBranch.length > 0) {
        branchId = existingBranch[0].id;
      } else {
        branchId = crypto.randomUUID();
        await db.insert(schema.branches).values({
          id: branchId,
          companyId: compId,
          name: 'Main Branch',
          code: 'HQ'
        });
      }

      // 3. Division
      let divId = '';
      const existingDiv = await db.select().from(schema.divisions).where(eq(schema.divisions.companyId, compId)).limit(1);
      if (existingDiv.length > 0) {
        divId = existingDiv[0].id;
      } else {
        divId = crypto.randomUUID();
        await db.insert(schema.divisions).values({
          id: divId,
          companyId: compId,
          name: 'Main Division',
          code: 'DIV-01'
        });
      }

      // 4. Department
      let deptId = '';
      const existingDept = await db.select().from(schema.departments).where(eq(schema.departments.divisionId, divId)).limit(1);
      if (existingDept.length > 0) {
        deptId = existingDept[0].id;
      } else {
        deptId = crypto.randomUUID();
        await db.insert(schema.departments).values({
          id: deptId,
          divisionId: divId,
          name: 'Management',
          code: 'MGT'
        });
      }

      // Job Grade (Need to ensure at least one exists for position)
      let jgId = '';
      const existingJG = await db.select().from(schema.jobGrades).limit(1);
      if (existingJG.length > 0) {
        jgId = existingJG[0].id;
      } else {
        jgId = crypto.randomUUID();
        await db.insert(schema.jobGrades).values({
          id: jgId,
          code: 'JG-1',
          name: 'Staff',
          level: 1
        });
      }

      // 5. Position
      let posId = '';
      const existingPos = await db.select().from(schema.positions).where(eq(schema.positions.code, 'POS-DIR')).limit(1);
      if (existingPos.length > 0) {
        posId = existingPos[0].id;
      } else {
        posId = crypto.randomUUID();
        await db.insert(schema.positions).values({
          id: posId,
          departmentId: deptId,
          jobGradeId: jgId,
          code: 'POS-DIR',
          name: 'Director'
        });
      }

      // Get Admin User
      const adminUsers = await db.select().from(schema.users).where(eq(schema.users.username, 'admin')).limit(1);
      let adminUserId = '';
      if (adminUsers.length > 0) {
        adminUserId = adminUsers[0].id;
        if (adminPassword) {
           const passwordHash = await bcrypt.hash(adminPassword, 10);
           await db.update(schema.users).set({ passwordHash }).where(eq(schema.users.id, adminUserId));
        }
      }

      // 6. Employee
      const existingEmp = await db.select().from(schema.employees).where(eq(schema.employees.employeeNumber, 'EMP-0001')).limit(1);
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
          userId: adminUserId,
          status: 'Active'
        });
      }

      res.json({ success: true, status: 'bootstrapCompleted' });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });`;

fs.writeFileSync('server.ts', prefix + newPost + suffixMatch[1]);
console.log('patched 3');
