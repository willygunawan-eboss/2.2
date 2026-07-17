const fs = require('fs');
const file = 'src/pages/EmpWorkspaceView.tsx';
let code = fs.readFileSync(file, 'utf8');

const importTransfer = "import { TransferEmployeeWizard } from '../components/EmpWorkspace/TransferEmployeeWizard';\n";
code = code.replace("import { HireEmployeeWizard } from '../components/EmpWorkspace/HireEmployeeWizard';", "import { HireEmployeeWizard } from '../components/EmpWorkspace/HireEmployeeWizard';\n" + importTransfer);

code = code.replace("const [isCreateOpen, setIsCreateOpen] = useState(false);", "const [isCreateOpen, setIsCreateOpen] = useState(false);\n  const [isTransferOpen, setIsTransferOpen] = useState(false);");

const transferBtn = `
            <button 
              onClick={() => setIsTransferOpen(true)}
              className="bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              Transfer Employee
            </button>
            <button 
`;
code = code.replace("<button \n              onClick={() => setIsCreateOpen(true)}", transferBtn + "<button \n              onClick={() => setIsCreateOpen(true)}");

const dialogRender = `
      {isCreateOpen && (
        <HireEmployeeWizard 
          onClose={() => setIsCreateOpen(false)}
          onSuccess={() => {
            setIsCreateOpen(false);
            handleRefresh();
          }}
        />
      )}
      {isTransferOpen && (
        <TransferEmployeeWizard 
          onClose={() => setIsTransferOpen(false)}
          onSuccess={() => {
            setIsTransferOpen(false);
            handleRefresh();
          }}
        />
      )}
`;

code = code.replace(
  /{isCreateOpen && \(\s*<div className="fixed inset-0[^]*?<\/div>\s*\)\s*}/g,
  dialogRender
);

fs.writeFileSync(file, code);
