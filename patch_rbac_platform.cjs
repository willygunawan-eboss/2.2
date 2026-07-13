const fs = require('fs');
let content = fs.readFileSync('src/routes/orgPlatformRoutes.ts', 'utf-8');
if (!content.includes('requirePermission')) {
  content = content.replace('import { OrganizationRegistryService', 'import { requirePermission } from "../middleware/rbac.js";\nimport { OrganizationRegistryService');
  // Secure the platform routes with requirePermission
  content = content.replace(/router.get\("\/registry", async/g, 'router.get("/registry", requirePermission("company", "read"), async');
  content = content.replace(/router.post\("\/cache\/refresh", async/g, 'router.post("/cache/refresh", requirePermission("company", "write"), async');
  content = content.replace(/router.get\("\/health", async/g, 'router.get("/health", requirePermission("company", "read"), async');
  content = content.replace(/router.get\("\/integrity", async/g, 'router.get("/integrity", requirePermission("company", "read"), async');
  content = content.replace(/router.get\("\/validate", async/g, 'router.get("/validate", requirePermission("company", "read"), async');
  content = content.replace(/router.get\("\/statistics", async/g, 'router.get("/statistics", requirePermission("company", "read"), async');
  fs.writeFileSync('src/routes/orgPlatformRoutes.ts', content);
}
