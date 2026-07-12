const fs = require('fs');
let lines = fs.readFileSync('server.ts', 'utf8').split('\n');

lines.splice(413, 5);

fs.writeFileSync('server.ts', lines.join('\n'));
console.log('patched 11');
