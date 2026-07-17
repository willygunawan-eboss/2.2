const fs = require('fs');

const file1 = 'src/pages/EmpWorkspaceView.tsx';
let code1 = fs.readFileSync(file1, 'utf8');

code1 = code1.replace(
  "import { TransferEmployeeWizard } from '../components/EmpWorkspace/TransferEmployeeWizard';",
  "import { TransferEmployeeWizard } from '../components/EmpWorkspace/TransferEmployeeWizard';\nimport { PromoteEmployeeWizard } from '../components/EmpWorkspace/PromoteEmployeeWizard';"
);

code1 = code1.replace(
  "const [isTransferOpen, setIsTransferOpen] = useState(false);",
  "const [isTransferOpen, setIsTransferOpen] = useState(false);\n  const [isPromoteOpen, setIsPromoteOpen] = useState(false);"
);

code1 = code1.replace(
  "Transfer Employee\n            </button>",
  `Transfer Employee
            </button>
            <button 
              onClick={() => setIsPromoteOpen(true)}
              className="bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              Promote Employee
            </button>`
);

code1 = code1.replace(
  `{isTransferOpen && (
        <TransferEmployeeWizard `,
  `{isPromoteOpen && (
        <PromoteEmployeeWizard 
          onClose={() => setIsPromoteOpen(false)}
          onSuccess={() => {
            setIsPromoteOpen(false);
            handleRefresh();
          }}
        />
      )}
      {isTransferOpen && (
        <TransferEmployeeWizard `
);

fs.writeFileSync(file1, code1);


const file2 = 'src/components/EmployeeWorkspace.tsx';
let code2 = fs.readFileSync(file2, 'utf8');

code2 = code2.replace(
  "import { TransferEmployeeWizard } from './EmpWorkspace/TransferEmployeeWizard';",
  "import { TransferEmployeeWizard } from './EmpWorkspace/TransferEmployeeWizard';\nimport { PromoteEmployeeWizard } from './EmpWorkspace/PromoteEmployeeWizard';"
);

code2 = code2.replace(
  "const [showTransferWizard, setShowTransferWizard] = useState(false);",
  "const [showTransferWizard, setShowTransferWizard] = useState(false);\n  const [showPromoteWizard, setShowPromoteWizard] = useState(false);"
);

code2 = code2.replace(
  "function EmployeeWorkspaceDetail({ employeeId }: { employeeId: string }) {",
  "function EmployeeWorkspaceDetail({ employeeId, onPromote }: { employeeId: string, onPromote: () => void }) {"
);

code2 = code2.replace(
  "<EmployeeWorkspaceDetail employeeId={selectedId} />",
  "<EmployeeWorkspaceDetail employeeId={selectedId} onPromote={() => setShowPromoteWizard(true)} />"
);

code2 = code2.replace(
  `<button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
               Transfer Employee <ChevronRight className="w-4 h-4" />
            </button>`,
  `<button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 flex items-center gap-2 border border-slate-200">
               Transfer
            </button>
            <button onClick={onPromote} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
               Promote <ChevronRight className="w-4 h-4" />
            </button>`
);

code2 = code2.replace(
  `{showTransferWizard && (
        <TransferEmployeeWizard `,
  `{showPromoteWizard && (
        <PromoteEmployeeWizard 
          onClose={() => setShowPromoteWizard(false)}
          onSuccess={() => {
            setShowPromoteWizard(false);
            fetchEmployees();
          }}
        />
      )}
      {showTransferWizard && (
        <TransferEmployeeWizard `
);

fs.writeFileSync(file2, code2);
