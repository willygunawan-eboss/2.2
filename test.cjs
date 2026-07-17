const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/erp.db');

db.serialize(() => {
  db.each("SELECT name FROM sqlite_master WHERE type='table'", (err, row) => {
    console.log(row.name);
  });
});
db.close();
