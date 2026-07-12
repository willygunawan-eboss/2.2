const fs = require('fs');
let orgRoutes = fs.readFileSync('src/routes/orgRoutes.ts', 'utf8');
let orgService = fs.readFileSync('src/services/OrganizationService.ts', 'utf8');

const interceptorRegex = /\/\/ Validation Interceptor[\s\S]*?next\(\);\n    \} catch \(e\) \{\n      res\.status\(500\)\.json\(\{ success: false, message: String\(e\) \}\);\n    \}\n  \}\);\n\n/;

orgRoutes = orgRoutes.replace(interceptorRegex, '');

let replacementCall = `
  // Create
  router.post(\`/\${path}\`, async (req, res) => {
    try {
      // Run readiness check
      const ready = await OrganizationService.checkReadiness(path);
      if (!ready.success) {
        return res.status(400).json({ success: false, error: [{ message: ready.message }] });
      }

      Object.keys(req.body).forEach(k => {
        if (req.body[k] === "") req.body[k] = null;
      });
`;
orgRoutes = orgRoutes.replace(
  /\/\/ Create\n  router\.post\(\`\/\$\{path\}\`, async \(req, res\) => \{\n    try \{\n      Object\.keys\(req\.body\)/,
  replacementCall
);

fs.writeFileSync('src/routes/orgRoutes.ts', orgRoutes);

const readinessFunc = `
  static async checkReadiness(path: string) {
    if (path === 'employees') {
      const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      if (!comp.length) return { success: false, message: 'Silakan lengkapi Master Company terlebih dahulu di menu Organization.' };
      const branch = await db.select({ id: schema.branches.id }).from(schema.branches).limit(1);
      if (!branch.length) return { success: false, message: 'Silakan lengkapi Master Branch terlebih dahulu.' };
      const dept = await db.select({ id: schema.departments.id }).from(schema.departments).limit(1);
      if (!dept.length) return { success: false, message: 'Silakan lengkapi Master Department terlebih dahulu.' };
      const pos = await db.select({ id: schema.positions.id }).from(schema.positions).limit(1);
      if (!pos.length) return { success: false, message: 'Silakan lengkapi Master Position terlebih dahulu.' };
    } else if (path === 'branches') {
      const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      if (!comp.length) return { success: false, message: 'Silakan lengkapi Master Company terlebih dahulu.' };
    } else if (path === 'departments') {
      const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      if (!comp.length) return { success: false, message: 'Silakan lengkapi Master Company terlebih dahulu.' };
    } else if (path === 'positions') {
      const dept = await db.select({ id: schema.departments.id }).from(schema.departments).limit(1);
      if (!dept.length) return { success: false, message: 'Silakan lengkapi Master Department terlebih dahulu.' };
    }
    return { success: true };
  }
`;

orgService = orgService.replace(
  /export class OrganizationService \{/,
  `import * as schema from "../db/schema.js";\n\nexport class OrganizationService {\n${readinessFunc}`
);

fs.writeFileSync('src/services/OrganizationService.ts', orgService);
