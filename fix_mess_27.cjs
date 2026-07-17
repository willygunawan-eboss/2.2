const fs = require('fs');

let file = 'src/db/seeder.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /isSystem: true\n\s*\}\);/g,
  `isSystem: true,
        code: "SYSTEM_" + roleId
      });`
);
fs.writeFileSync(file, code);

file = 'src/routes/assetRoutes.ts';
if (fs.existsSync(file)) {
  let assetCode = fs.readFileSync(file, 'utf8');
  assetCode = assetCode.replace(/project: true,?/g, '');
  fs.writeFileSync(file, assetCode);
}
