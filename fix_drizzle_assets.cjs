const fs = require('fs');

let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /branch: one\(branches, \{[\s\S]*?fields: \[assets.branchId\],[\s\S]*?references: \[branches.id\],[\s\S]*?\}\),/g, ''
);
// Make sure this doesn't exist either
code = code.replace(
  /branch: one\(branches, \{\s*fields: \[assets.branchId\],\s*references: \[branches.id\],\s*\}\),/g, ''
);

fs.writeFileSync(file, code);

