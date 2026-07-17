const fs = require('fs');
let s = fs.readFileSync('drizzle/0000_easy_hitman.sql', 'utf8');
s = s.replace(/CREATE UNIQUE INDEX IF NOT EXISTS `roles_code_unique` ON `roles` \(`code`\);ALTER TABLE `invoices` ADD `version` integer DEFAULT 1 NOT NULL;/g, 'CREATE UNIQUE INDEX IF NOT EXISTS `roles_code_unique` ON `roles` (`code`);\n--> statement-breakpoint\nALTER TABLE `invoices` ADD `version` integer DEFAULT 1 NOT NULL;');
fs.writeFileSync('drizzle/0000_easy_hitman.sql', s);
