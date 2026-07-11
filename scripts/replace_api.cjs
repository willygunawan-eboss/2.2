const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `  app.get("/api/bootstrap/status", async (req, res) => {
    try {
      const companies = await db.select({ id: schema.companies.id }).from(schema.companies);
      const branches = await db.select({ id: schema.branches.id }).from(schema.branches);
      const divisions = await db.select({ id: schema.divisions.id }).from(schema.divisions);
      const departments = await db.select({ id: schema.departments.id }).from(schema.departments);
      const positions = await db.select({ id: schema.positions.id }).from(schema.positions);
      
      const roles = await db.select({ id: schema.roles.id }).from(schema.roles);
      const permissions = await db.select({ id: schema.permissions.id }).from(schema.permissions);

      const refs = await db.select({ id: schema.referenceGroups.id }).from(schema.referenceGroups);
      
      const employees = await db.select({ id: schema.employees.id }).from(schema.employees);
      const jobGrades = await db.select({ id: schema.jobGrades.id }).from(schema.jobGrades);

      const customers = await db.select({ id: schema.customers.id }).from(schema.customers);
      
      // Calculate readiness per module
      const orgReady = companies.length > 0 && branches.length > 0 && departments.length > 0;
      const hrReady = employees.length > 0 && positions.length > 0;
      const refReady = refs.length > 0;
      const rbacReady = roles.length > 0;
      const crmReady = customers.length > 0;

      const isSystemReady = orgReady && hrReady && refReady && rbacReady;

      res.json({ 
        success: true,
        data: {
          erpReady: isSystemReady,
          systemReady: isSystemReady,
          modules: {
            organization: {
              ready: orgReady,
              progress: Math.round(((companies.length > 0 ? 1 : 0) + (branches.length > 0 ? 1 : 0) + (divisions.length > 0 ? 1 : 0) + (departments.length > 0 ? 1 : 0) + (positions.length > 0 ? 1 : 0)) / 5 * 100),
              details: {
                companies: companies.length,
                branches: branches.length,
                divisions: divisions.length,
                departments: departments.length,
                positions: positions.length
              },
              dependencies: []
            },
            hr: {
              ready: hrReady,
              progress: Math.round(((employees.length > 0 ? 1 : 0) + (jobGrades.length > 0 ? 1 : 0)) / 2 * 100),
              details: {
                employees: employees.length,
                jobGrades: jobGrades.length
              },
              dependencies: ['organization']
            },
            reference: {
              ready: refReady,
              progress: refs.length > 0 ? 100 : 0,
              details: {
                referenceGroups: refs.length
              },
              dependencies: []
            },
            rbac: {
              ready: rbacReady,
              progress: Math.round(((roles.length > 0 ? 1 : 0) + (permissions.length > 0 ? 1 : 0)) / 2 * 100),
              details: {
                roles: roles.length,
                permissions: permissions.length
              },
              dependencies: []
            },
            crm: {
              ready: crmReady,
              progress: customers.length > 0 ? 100 : 0,
              details: {
                customers: customers.length
              },
              dependencies: ['organization']
            },
            asset: { ready: false, progress: 0, details: {}, dependencies: ['organization'] },
            finance: { ready: false, progress: 0, details: {}, dependencies: ['organization'] },
            helpdesk: { ready: false, progress: 0, details: {}, dependencies: ['organization', 'hr'] }
          }
        }
      });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });`;

content = content.replace(/app\.get\("\/api\/bootstrap\/status", async \(req, res\) => \{[\s\S]*?\}\);/, replacement);
fs.writeFileSync('server.ts', content);
