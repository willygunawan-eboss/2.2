const fs = require('fs');
let content = fs.readFileSync('src/pages/SystemReadinessView.tsx', 'utf8');

const setupCenterModifications = `
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 md:p-8 text-white shadow-lg mb-6">
        <h2 className="text-2xl font-bold mb-2">ERP Setup Center</h2>
        <p className="text-blue-100 max-w-2xl text-sm mb-6">Track your enterprise implementation progress. A fully configured system ensures all modules function harmoniously.</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Implementation Progress</span>
            <span>{Math.round((statusCounts.pass / Math.max(1, (statusCounts.pass + statusCounts.warning + statusCounts.error))) * 100)}%</span>
          </div>
          <div className="h-2 w-full bg-blue-900/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-full transition-all duration-1000" 
              style={{ width: \`\${Math.round((statusCounts.pass / Math.max(1, (statusCounts.pass + statusCounts.warning + statusCounts.error))) * 100)}%\` }}
            />
          </div>
        </div>
      </div>
`;

content = content.replace(
  /<div className="flex justify-between items-end">[\s\S]*?<\/div>\n      <div className="grid grid-cols-3 gap-4 mb-6">/,
  setupCenterModifications + "\n      <div className=\"grid grid-cols-3 gap-4 mb-6\">"
);

fs.writeFileSync('src/pages/SystemReadinessView.tsx', content);
