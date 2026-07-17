const fs = require('fs');
const file = 'src/components/EmployeeWorkspace.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  "const [search, setSearch] = useState('');",
  "const [search, setSearch] = useState('');\n  const [showPromoteWizard, setShowPromoteWizard] = useState(false);\n  const [showTransferWizard, setShowTransferWizard] = useState(false);\n  const [showHireWizard, setShowHireWizard] = useState(false);"
);

fs.writeFileSync(file, code);
