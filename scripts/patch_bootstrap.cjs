const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

// 1. Update authMiddleware
content = content.replace(
  `if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health', '/api/system/health'].includes(req.path)) return next();`,
  `if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/health', '/api/system/health', '/api/bootstrap/status', '/api/bootstrap'].includes(req.path)) return next();`
);
content = content.replace(
  `if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout'].includes(req.path) || req.path.startsWith('/api/health') || req.path.startsWith('/api/system/health')) return next();`,
  `if (['/api/auth/login', '/api/auth/refresh', '/api/auth/logout', '/api/bootstrap/status', '/api/bootstrap'].includes(req.path) || req.path.startsWith('/api/health') || req.path.startsWith('/api/system/health')) return next();`
);

// 2. Remove old GET /api/bootstrap/status
const oldStatusApiRegex = /app\.get\("\/api\/bootstrap\/status", async \(req, res\) => \{[\s\S]*?\}\);/g;
content = content.replace(oldStatusApiRegex, `app.get("/api/bootstrap/status", async (req, res) => {
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
  });`);

fs.writeFileSync('server.ts', content);
console.log('patched bootstrap');
