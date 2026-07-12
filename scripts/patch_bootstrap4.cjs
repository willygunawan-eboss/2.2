const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/userId: adminUserId,/g, '');

fs.writeFileSync('server.ts', content);
console.log('patched 4');
