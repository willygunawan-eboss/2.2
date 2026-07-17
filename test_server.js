const server = require('fs').readFileSync('server.ts', 'utf8');
const lines = server.split('\n');
lines.forEach((l, i) => { if (l.includes('financialRoutes')) console.log(`${i+1}: ${l}`); });
