const fs = require('fs');
let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// I will just download the original schema.ts from the start of the session and redo my changes safely.
