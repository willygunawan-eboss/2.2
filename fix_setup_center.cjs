const fs = require('fs');

let content = fs.readFileSync('src/pages/SetupCenterView.tsx', 'utf8');

// The file currently has multiple `path: 'org_workspace'` because of my bad sed command.
// We will replace all of them with `path: 'settings'` first.
content = content.replace(/path: 'org_workspace'/g, "path: 'settings'");

// Now replace only the one for 'organization'
content = content.replace(
  /id: 'organization',([\s\S]*?)path: 'settings'/m,
  "id: 'organization',$1path: 'org_workspace'"
);

fs.writeFileSync('src/pages/SetupCenterView.tsx', content);
console.log("Fixed SetupCenterView paths");
