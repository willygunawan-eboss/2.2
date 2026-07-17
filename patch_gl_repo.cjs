const fs = require('fs');
let code = fs.readFileSync('src/services/general-ledger/infrastructure/GeneralLedgerRepository.ts', 'utf8');

code = code.replace(
  'const results = await db.all(query);',
  'const results = (await db.all(query)) as any[];'
);

fs.writeFileSync('src/services/general-ledger/infrastructure/GeneralLedgerRepository.ts', code);
