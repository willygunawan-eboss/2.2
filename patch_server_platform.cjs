const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

if (!content.includes('orgPlatformRoutes')) {
  content = content.replace(
    'import orgWorkspaceRoutes from "./src/routes/orgWorkspaceRoutes.js";',
    'import orgWorkspaceRoutes from "./src/routes/orgWorkspaceRoutes.js";\nimport orgPlatformRoutes from "./src/routes/orgPlatformRoutes.js";'
  );
  content = content.replace(
    'app.use("/api/organization/workspace", orgWorkspaceRoutes);',
    'app.use("/api/organization/workspace", orgWorkspaceRoutes);\n  app.use("/api/organization/platform", orgPlatformRoutes);'
  );
  
  fs.writeFileSync('server.ts', content);
}
