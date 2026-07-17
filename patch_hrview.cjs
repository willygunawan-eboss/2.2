const fs = require('fs');
let content = fs.readFileSync('src/pages/HRView.tsx', 'utf-8');

// Add import
if (!content.includes('EmployeeWorkspace')) {
  content = content.replace(/import \{ (.*) \} from 'lucide-react';/, "import { $1 } from 'lucide-react';\nimport { EmployeeWorkspace } from '../components/EmployeeWorkspace';");
}

// Replace <EmployeeDirectoryTab /> with <EmployeeWorkspace />
content = content.replace(/<EmployeeDirectoryTab \/>/g, '<EmployeeWorkspace />');

fs.writeFileSync('src/pages/HRView.tsx', content);
console.log('Patched HRView');
