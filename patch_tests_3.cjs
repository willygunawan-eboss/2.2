const fs = require('fs');

let file = 'src/services/workforce/application/HireEmployeeUseCase.test.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /findAll: async \(\) => \[\]/g,
  "findByEmployeeNumber: async () => null"
);

fs.writeFileSync(file, code);

