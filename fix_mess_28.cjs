const fs = require('fs');

let file = 'src/db/seeder.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /isSystem: true,\n        code: "SYSTEM_" \+ roleId\n      \}\);/g,
  `isSystem: true\n        });`
);

// Wait, for roles, it still needs to add code.
code = code.replace(
  /name: roleName,\n        description: `\$\{roleName\} Role`,\n        isSystem: true\n        \}\);/g,
  `name: roleName,\n        description: \`\$\{roleName\} Role\`,\n        isSystem: true,\n        code: "SYSTEM_" + roleId\n      });`
);

fs.writeFileSync(file, code);

