const fs = require('fs');
let content = fs.readFileSync('src/routes/orgRoutes.ts', 'utf8');

const replacement = `
// Generic CRUD Generator
const buildCrud = (path: string, table: any, validationSchema: any, searchFields: any[]) => {
  // List
  router.get(\`/\${path}\`, async (req, res) => {
    try {
      const result = await OrganizationService.list(table, req.query, searchFields);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get by ID
  router.get(\`/\${path}/:id\`, async (req, res) => {
    try {
      const data = await OrganizationService.getById(table, req.params.id);
      if (!data) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Validation Interceptor
  router.post(\`/\${path}\`, async (req, res, next) => {
    try {
      if (path === 'employees') {
        const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
        if (!comp.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Company terlebih dahulu di menu Organization.' }] });
        const branch = await db.select({ id: schema.branches.id }).from(schema.branches).limit(1);
        if (!branch.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Branch terlebih dahulu.' }] });
        const dept = await db.select({ id: schema.departments.id }).from(schema.departments).limit(1);
        if (!dept.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Department terlebih dahulu.' }] });
        const pos = await db.select({ id: schema.positions.id }).from(schema.positions).limit(1);
        if (!pos.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Position terlebih dahulu.' }] });
      } else if (path === 'branches') {
        const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
        if (!comp.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Company terlebih dahulu.' }] });
      } else if (path === 'departments') {
        const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
        if (!comp.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Company terlebih dahulu.' }] });
      } else if (path === 'positions') {
        const dept = await db.select({ id: schema.departments.id }).from(schema.departments).limit(1);
        if (!dept.length) return res.status(400).json({ success: false, error: [{ message: 'Silakan lengkapi Master Department terlebih dahulu.' }] });
      }
      next();
    } catch (e) {
      res.status(500).json({ success: false, message: String(e) });
    }
  });

  // Create
  router.post(\`/\${path}\`, async (req, res) => {
    try {
      Object.keys(req.body).forEach(k => {
        if (req.body[k] === "") req.body[k] = null;
      });
      const validatedData = validationSchema.parse(req.body);
      // @ts-ignore
      const result = await OrganizationService.create(table, validatedData, req.user?.username);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ success: false, error: error.errors });
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update
  router.put(\`/\${path}/:id\`, async (req, res) => {
    try {
      Object.keys(req.body).forEach(k => {
        if (req.body[k] === "") req.body[k] = null;
      });
      const validatedData = validationSchema.partial().parse(req.body);
      // @ts-ignore
      const updated = await OrganizationService.update(table, req.params.id, validatedData, req.user?.username);
      if (!updated) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, message: "Updated successfully" });
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ success: false, error: error.errors });
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete
  router.delete(\`/\${path}/:id\`, async (req, res) => {
    try {
      // @ts-ignore
      const deleted = await OrganizationService.delete(table, req.params.id, req.user?.username);
      if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};
`;

content = content.replace(
  /\/\/ Generic CRUD Generator[\s\S]*?\}\);\n\};\n/,
  replacement
);

// We also need to fix references endpoint
const refReplacement = `
// References
router.get('/references/all', async (req, res) => {
  try {
    const data = await OrganizationService.getReferences(schema);
    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});
`;

content = content.replace(
  /\/\/ References[\s\S]*?\}\);\n/,
  refReplacement
);

content = 'import { OrganizationService } from "../services/OrganizationService.js";\n' + content;

fs.writeFileSync('src/routes/orgRoutes.ts', content);
