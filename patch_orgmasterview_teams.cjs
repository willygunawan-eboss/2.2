const fs = require('fs');
let content = fs.readFileSync('src/pages/OrgMasterView.tsx', 'utf8');

content = content.replace(
  /'company': 'companies' \};/,
  `'company': 'companies', 'team': 'teams' };`
);

fs.writeFileSync('src/pages/OrgMasterView.tsx', content);
