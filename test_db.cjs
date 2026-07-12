const sqlite = require('better-sqlite3');
const db = sqlite('data/erp.db');
console.log("Depts: ", db.prepare('SELECT id, name FROM departments').all());
console.log("Positions: ", db.prepare('SELECT id, name, department_id FROM positions').all());
