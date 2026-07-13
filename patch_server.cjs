const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf-8');

if (!content.includes('orgWorkspaceRoutes')) {
  content = content.replace(
    'import orgRoutes from "./src/routes/orgRoutes";', 
    'import orgRoutes from "./src/routes/orgRoutes.js";\nimport orgWorkspaceRoutes from "./src/routes/orgWorkspaceRoutes.js";'
  );
  content = content.replace(
    'app.use("/api/org", orgRoutes);',
    'app.use("/api/org", orgRoutes);\n  app.use("/api/organization/workspace", orgWorkspaceRoutes);'
  );
  
  // Also fix the previous orgRoutes import to include .js since it's ESM
  content = content.replace('import orgRoutes from "./src/routes/orgRoutes";', 'import orgRoutes from "./src/routes/orgRoutes.js";');
  fs.writeFileSync('server.ts', content);
}
