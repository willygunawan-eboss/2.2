const fs = require('fs');
let file = 'src/routes/rbacRoutes.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /code: code \|\| \\`ROLE_\\\$\{Date.now\(\)\}\\`/g,
  'code: code || `ROLE_${Date.now()}`'
);

fs.writeFileSync(file, code);

