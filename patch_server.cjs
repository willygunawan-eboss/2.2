const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

if (!code.includes('financialRoutes')) {
  code = code.replace(
    'import { ticketRoutes } from "./src/routes/ticketRoutes";',
    'import { ticketRoutes } from "./src/routes/ticketRoutes";\nimport { financialRoutes } from "./src/routes/financialRoutes";'
  );
  code = code.replace(
    'app.use("/api/tickets", ticketRoutes);',
    'app.use("/api/tickets", ticketRoutes);\n  app.use("/api/financials", financialRoutes);'
  );
  fs.writeFileSync('server.ts', code);
}
