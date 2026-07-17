const fs = require('fs');
const file = 'src/pages/EmpWorkspaceView.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '            <button \n              onClick={() => setIsCreateOpen(true)}',
  '            <button \n              onClick={() => setIsCreateOpen(true)}'
);

// I should just view the file around line 59 and replace it properly.
