const fs = require('fs');
let content = fs.readFileSync('src/routes/orgPlatformRoutes.ts', 'utf-8');

content = content.replace(/requirePermission\("company", "read"\)/g, 'requirePermission("company.read")');
content = content.replace(/requirePermission\("company", "write"\)/g, 'requirePermission("company.write")');

fs.writeFileSync('src/routes/orgPlatformRoutes.ts', content);
