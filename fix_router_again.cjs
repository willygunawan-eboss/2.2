const fs = require('fs');

let file = 'src/services/workforce/presentation/WorkforceRouter.ts';
let code = fs.readFileSync(file, 'utf8');
code = code.replace(
  `// hireEmployeeUseCase will be below`,
  ``
);
fs.writeFileSync(file, code);

