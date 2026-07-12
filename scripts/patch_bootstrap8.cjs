const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const oldCode = `const sqlQuery = require('drizzle-orm').sql\``;
const newCode = `const sqlQuery = sql\``;

content = content.replace(oldCode, newCode);
fs.writeFileSync('server.ts', content);
console.log('patched 8');
