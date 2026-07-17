const fs = require('fs');
const file = 'src/pages/EmpWorkspaceView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace('<button <button', '<button');

fs.writeFileSync(file, code);
