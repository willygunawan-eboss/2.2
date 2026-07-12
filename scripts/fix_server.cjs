const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

// I will extract everything before app.get("/api/bootstrap/status"
const prefix = content.split('app.get("/api/bootstrap/status"')[0];

// I will extract everything after app.get("/api/system/health"
const suffixMatch = content.match(/app\.get\("\/api\/system\/health", async \(req, res\) => \{[\s\S]*/);
const suffix = suffixMatch ? suffixMatch[0] : '';

const middle = `app.get("/api/bootstrap/status", async (req, res) => {
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
      
      const compId = crypto.randomUUID();
      await db.insert(schema.companies).values({
        id: compId,
        name: companyName,
        code: 'COMP-01'
      });
      
      const branchId = crypto.randomUUID();
      await db.insert(schema.branches).values({
        id: branchId,
        companyId: compId,
        name: 'Main Branch',
        code: 'HQ'
      });
      
      const deptId = crypto.randomUUID();
      await db.insert(schema.departments).values({
        id: deptId,
        branchId: branchId,
        name: 'Management',
        code: 'MGT'
      });

      if (adminPassword) {
         const passwordHash = await bcrypt.hash(adminPassword, 10);
         await db.update(schema.users).set({ passwordHash }).where(eq(schema.users.username, 'admin'));
      }
      
      res.json({ success: true, status: 'bootstrapCompleted' });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });

  `;

fs.writeFileSync('server.ts', prefix + middle + suffix);
console.log('fixed server');
