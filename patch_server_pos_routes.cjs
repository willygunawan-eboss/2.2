const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const importStr = `import positionPlatformRoutes from "./src/routes/positionPlatformRoutes.js";`;
content = content.replace(
  'import employmentPlatformRoutes from "./src/routes/employmentPlatformRoutes.js";',
  'import employmentPlatformRoutes from "./src/routes/employmentPlatformRoutes.js";\n' + importStr
);

const routeStr = `app.use("/api/position", positionPlatformRoutes);`;
content = content.replace(
  'app.use("/api/employment", employmentPlatformRoutes);',
  'app.use("/api/employment", employmentPlatformRoutes);\n  ' + routeStr
);

fs.writeFileSync('server.ts', content);
