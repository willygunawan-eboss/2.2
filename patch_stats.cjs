const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const dynamicStats = `
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const activeEmployees = await db.select({ count: sql\`count(*)\` }).from(schema.employees).where(eq(schema.employees.status, 'Active'));
      const totalDepartments = await db.select({ count: sql\`count(*)\` }).from(schema.departments);
      const openTickets = await db.select({ count: sql\`count(*)\` }).from(schema.tickets).where(eq(schema.tickets.statusId, 'open'));
      const monthlyRevenue = 0; // Keeping 0 for now as finance is not implemented yet
      
      res.json({ success: true, data: {
        activeEmployees: activeEmployees[0]?.count || 0,
        totalDepartments: totalDepartments[0]?.count || 0,
        openTickets: openTickets[0]?.count || 0,
        monthlyRevenue
      } });
    } catch (e) {
      res.status(500).json({ success: false, error: String(e) });
    }
  });
`;

content = content.replace(
  /app\.get\("\/api\/dashboard\/stats", async \(req, res\) => \{[\s\S]*?\}\);/m,
  dynamicStats
);

fs.writeFileSync('server.ts', content);
