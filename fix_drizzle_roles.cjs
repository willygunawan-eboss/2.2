const fs = require('fs');

let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// The original file is severely messed up due to a bad replace.
// Let's recover the original schema.ts from the git checkout
