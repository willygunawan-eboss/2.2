const fs = require('fs');
const file = 'src/components/EmployeeWorkspace.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  '<EmployeeWorkspaceDetail employeeId={selectedId} onPromote={() => setShowPromoteWizard(true)} />',
  '<EmployeeWorkspaceDetail employeeId={selectedId} onPromote={() => setShowPromoteWizard(true)} />'
);

// wait, the error is at 119:77 in EmployeeWorkspace.tsx.
// Let's just check where setShowPromoteWizard is missing.
