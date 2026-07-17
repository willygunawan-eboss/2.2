const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');
if (!code.includes('import { financialRoutes }')) {
  code = code.replace(
    'import employeeRoutes from "./src/routes/employeeRoutes";',
    'import employeeRoutes from "./src/routes/employeeRoutes";\nimport { financialRoutes } from "./src/routes/financialRoutes";'
  );
  fs.writeFileSync('server.ts', code);
}
