const fs = require('fs');

function revertRepo(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  const regex = /\/\/ Optimistic locking enforced\s*const existing = await dbClient\.select\(\{ version: invoices\.version \}\)\.from\(invoices\)\.where\(eq\(invoices\.id, invoice\.id\)\)\.get\(\);\s*if \(existing\) \{\s*if \(invoice\.version <= existing\.version\) \{\s*throw new Error\('Optimistic concurrency error: The invoice has been modified by another transaction'\);\s*\}\s*dbData\.version = invoice\.version;\s*await dbClient\.update\(invoices\)\.set\(dbData\)\.where\(and\(eq\(invoices\.id, invoice\.id\), eq\(invoices\.version, existing\.version\)\)\);\s*\} else \{\s*dbData\.version = invoice\.version;\s*await dbClient\.insert\(invoices\)\.values\(dbData\);\s*\}/g;
  
  code = code.replace(regex, `await dbClient.insert(invoices).values(dbData)
      .onConflictDoUpdate({ target: invoices.id, set: dbData });`);
      
  fs.writeFileSync(file, code);
}

revertRepo('src/services/accounts-payable/infrastructure/AccountsPayableRepository.ts');
revertRepo('src/services/accounts-receivable/infrastructure/AccountsReceivableRepository.ts');
