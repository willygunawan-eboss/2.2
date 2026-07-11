const fs = require('fs');
let content = fs.readFileSync('src/contexts/RBACContext.tsx', 'utf8');

content = content.replace(
  "if (res.ok) {",
  "if (res.ok) {\n        const contentType = res.headers.get('content-type');\n        if (!contentType || !contentType.includes('application/json')) {\n          console.warn('RBAC context returned non-JSON:', await res.text());\n          return;\n        }"
);
fs.writeFileSync('src/contexts/RBACContext.tsx', content);
