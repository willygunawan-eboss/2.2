const fs = require('fs');
let s = fs.readFileSync('drizzle/0000_easy_hitman.sql', 'utf8');
s = s.replace(/`code`\);\s*ALTER TABLE/g, '`code`);\n--> statement-breakpoint\nALTER TABLE');
fs.writeFileSync('drizzle/0000_easy_hitman.sql', s);
