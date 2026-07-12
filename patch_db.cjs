const Database = require('better-sqlite3');
const db = new Database('data/erp.db');

try { db.exec("ALTER TABLE companies ADD COLUMN legal_name TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN business_type TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN industry TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN tax_number TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN registration_number TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN website TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN logo TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN country TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN province TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN city TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN postal_code TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN currency TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN timezone TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN language TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN status TEXT DEFAULT 'Active';"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN notes TEXT;"); } catch(e) {}
try { db.exec("ALTER TABLE companies ADD COLUMN is_default INTEGER DEFAULT 0;"); } catch(e) {}

db.exec(`
CREATE TABLE IF NOT EXISTS company_audits (
  id TEXT PRIMARY KEY,
  company_id TEXT NOT NULL REFERENCES companies(id),
  action TEXT NOT NULL,
  changes TEXT,
  performed_by TEXT,
  performed_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

console.log("Database patched.");
