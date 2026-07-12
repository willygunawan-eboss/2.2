const sqlite = require('better-sqlite3');
const db = sqlite('data/erp.db');
console.log(db.prepare("PRAGMA table_info(employees)").all());
