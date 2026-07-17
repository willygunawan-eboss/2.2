const fs = require('fs');

// 1. Fix HireEmployeeWizardProps
const hireFile = 'src/components/EmpWorkspace/HireEmployeeWizard.tsx';
let hireCode = fs.readFileSync(hireFile, 'utf8');
if (!hireCode.includes('onSuccess: () => void;')) {
  hireCode = hireCode.replace(
    'interface HireEmployeeWizardProps {\n  onClose: () => void;\n}',
    'interface HireEmployeeWizardProps {\n  onClose: () => void;\n  onSuccess?: () => void;\n}'
  );
  hireCode = hireCode.replace(
    'export function HireEmployeeWizard({ onClose }: HireEmployeeWizardProps) {',
    'export function HireEmployeeWizard({ onClose, onSuccess }: HireEmployeeWizardProps) {'
  );
  
  // also call onSuccess after successful request
  hireCode = hireCode.replace(
    'onClose();',
    'if (onSuccess) onSuccess(); else onClose();'
  );
  
  fs.writeFileSync(hireFile, hireCode);
}

// 2. Fix EmployeeWorkspace.tsx
const empFile = 'src/components/EmployeeWorkspace.tsx';
let empCode = fs.readFileSync(empFile, 'utf8');

empCode = empCode.replace(
  '<EmployeeWorkspaceDetail employeeId={selectedId} onTransfer={() => setShowTransferWizard(true)} />',
  '<EmployeeWorkspaceDetail employeeId={selectedId} />'
);

empCode = empCode.replace(
  'function EmployeeWorkspaceDetail({ employeeId, onTransfer }: { employeeId: string, onTransfer: () => void }) {',
  'function EmployeeWorkspaceDetail({ employeeId }: { employeeId: string }) {'
);

empCode = empCode.replace(
  '<button onClick={onTransfer} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">',
  '<button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">'
);

fs.writeFileSync(empFile, empCode);

