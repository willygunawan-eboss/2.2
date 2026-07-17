const Database = require('better-sqlite3');
const db = new Database('data/erp.db');
try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Tables:");
  tables.forEach(t => console.log(t.name));
  
  try {
    const migrations = db.prepare("SELECT * FROM __drizzle_migrations").all();
    console.log("Migrations:", migrations);
  } catch (e) {
    console.log("No migrations table.");
  }
} catch (e) {
  console.log("Error:", e);
}
