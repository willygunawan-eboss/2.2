const fs = require('fs');
const file = 'src/components/EmployeeWorkspace.tsx';
let code = fs.readFileSync(file, 'utf8');

const importHire = "import { HireEmployeeWizard } from './EmpWorkspace/HireEmployeeWizard';";
const importTransfer = "import { HireEmployeeWizard } from './EmpWorkspace/HireEmployeeWizard';\nimport { TransferEmployeeWizard } from './EmpWorkspace/TransferEmployeeWizard';";

if (!code.includes('TransferEmployeeWizard')) {
  code = code.replace(importHire, importTransfer);

  const stateHire = "const [showHireWizard, setShowHireWizard] = useState(false);";
  const stateTransfer = "const [showHireWizard, setShowHireWizard] = useState(false);\n  const [showTransferWizard, setShowTransferWizard] = useState(false);";
  code = code.replace(stateHire, stateTransfer);

  // We need to add the Transfer Employee button. I will add it to the header actions.
  // We need to pass setShowTransferWizard down? No, the EmployeeWorkspaceDetail doesn't have it.
  // Wait, EmployeeWorkspaceDetail is a subcomponent in the same file.
  
  // Let's pass setShowTransferWizard to EmployeeWorkspaceDetail
  code = code.replace(
    "<EmployeeWorkspaceDetail employeeId={selectedId} />",
    "<EmployeeWorkspaceDetail employeeId={selectedId} onTransfer={() => setShowTransferWizard(true)} />"
  );
  
  code = code.replace(
    "function EmployeeWorkspaceDetail({ employeeId }: { employeeId: string }) {",
    "function EmployeeWorkspaceDetail({ employeeId, onTransfer }: { employeeId: string, onTransfer: () => void }) {"
  );

  code = code.replace(
    "Quick Action <ChevronRight className=\"w-4 h-4\" />",
    "Transfer Employee <ChevronRight className=\"w-4 h-4\" />"
  );

  code = code.replace(
    "<button className=\"px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2\">",
    "<button onClick={onTransfer} className=\"px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2\">"
  );
  
  // Also render TransferEmployeeWizard at the bottom of EmployeeWorkspace
  const hireWizardRender = "{showHireWizard && (\n        <HireEmployeeWizard \n          onClose={() => setShowHireWizard(false)}\n          onSuccess={() => {\n            setShowHireWizard(false);\n            fetchEmployees();\n          }}\n        />\n      )}";
  
  const transferWizardRender = hireWizardRender + "\n      {showTransferWizard && (\n        <TransferEmployeeWizard \n          onClose={() => setShowTransferWizard(false)}\n          onSuccess={() => {\n            setShowTransferWizard(false);\n            fetchEmployees();\n          }}\n        />\n      )}";
  
  code = code.replace(hireWizardRender, transferWizardRender);

  fs.writeFileSync(file, code);
}
