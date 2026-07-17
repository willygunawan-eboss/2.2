const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  // Remove the old 'const existing = ... invoices.amountDue ...' and comments
  code = code.replace(/\/\/ Optimistic locking logic\s*const existing = await dbClient\.select\(\{ version: invoices\.amountDue \}\)\.from\(invoices\)\.where\(eq\(invoices\.id, invoice\.id\)\)\.get\(\);\s*\/\/ Using amountDue as creditedAmount \+ version store for now if no version column is on invoices\.\s*\/\/ Wait, let's just use raw SQL to insert or update\./, '');
  
  // Wait, there's another "existing" that will conflict. I should rename the second one to `existingVersion`.
  code = code.replace(/const existing = await dbClient\.select\(\{ version: invoices\.version \}\)\.from\(invoices\)\.where\(eq\(invoices\.id, invoice\.id\)\)\.get\(\);/g, 
    'const existingVersion = await dbClient.select({ version: invoices.version }).from(invoices).where(eq(invoices.id, invoice.id)).get();');
  code = code.replace(/if \(existing\) \{/g, 'if (existingVersion) {');
  code = code.replace(/existing\.version/g, 'existingVersion.version');
  
  fs.writeFileSync(file, code);
}

fixFile('src/services/accounts-payable/infrastructure/AccountsPayableRepository.ts');
fixFile('src/services/accounts-receivable/infrastructure/AccountsReceivableRepository.ts');
