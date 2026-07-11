const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const replacement = `  app.get("/api/system/health", async (req, res) => {
    try {
      const companies = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      const branches = await db.select({ id: schema.branches.id }).from(schema.branches).limit(1);
      const departments = await db.select({ id: schema.departments.id }).from(schema.departments).limit(1);
      const positions = await db.select({ id: schema.positions.id }).from(schema.positions).limit(1);
      const roles = await db.select({ id: schema.roles.id }).from(schema.roles).limit(1);
      const refs = await db.select({ id: schema.referenceGroups.id }).from(schema.referenceGroups).limit(1);
      const employees = await db.select({ id: schema.employees.id }).from(schema.employees).limit(1);
      const customers = await db.select({ id: schema.customers.id }).from(schema.customers).limit(1);

      res.json({
        success: true,
        data: {
          database: 'Pass',
          api: 'Pass',
          migration: 'Pass',
          seeder: 'Warning',
          reference: refs.length > 0 ? 'Pass' : 'Error',
          rbac: roles.length > 0 ? 'Pass' : 'Error',
          organization: (companies.length > 0 && branches.length > 0 && departments.length > 0) ? 'Pass' : 'Warning',
          hr: (employees.length > 0 && positions.length > 0) ? 'Pass' : 'Error',
          crm: customers.length > 0 ? 'Pass' : 'Warning',
          finance: 'Warning',
          asset: 'Warning',
          helpdesk: 'Warning',
          notification: 'Warning',
          integration: 'Warning'
        }
      });
    } catch (e) {
      res.json({
        success: false,
        data: {
          database: 'Error',
          api: 'Pass',
          migration: 'Error',
          seeder: 'Error',
          reference: 'Error',
          rbac: 'Error',
          organization: 'Error',
          hr: 'Error',
          crm: 'Error',
          finance: 'Error',
          asset: 'Error',
          helpdesk: 'Error',
          notification: 'Error',
          integration: 'Error'
        }
      });
    }
  });`;

content = content.replace(/app\.get\("\/api\/system\/health", async \(req, res\) => \{[\s\S]*?\}\);/g, replacement);
fs.writeFileSync('server.ts', content);
