const fs = require('fs');
let sql = fs.readFileSync('drizzle/0000_easy_hitman.sql', 'utf8');
if (!sql.includes('`code` text NOT NULL')) {
  // we just need to add it to roles table.
  const regex = /(CREATE TABLE IF NOT EXISTS `roles` \(\n\t`id` text PRIMARY KEY NOT NULL,\n)/;
  sql = sql.replace(regex, '$1\t`code` text NOT NULL,\n');
  fs.writeFileSync('drizzle/0000_easy_hitman.sql', sql);
}
