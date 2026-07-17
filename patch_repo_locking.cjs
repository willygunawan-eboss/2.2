const fs = require('fs');

function patchRepo(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  if (code.includes('Optimistic locking enforced')) return; // already patched

  code = code.replace(
    /await dbClient\.insert\(invoices\)\.values\(dbData\)\n\s*\.onConflictDoUpdate\(\{ target: invoices\.id, set: dbData \}\);/,
    `// Optimistic locking enforced
    const existing = await dbClient.select({ version: invoices.version }).from(invoices).where(eq(invoices.id, invoice.id)).get();
    if (existing) {
      if (invoice.version <= existing.version) {
        throw new Error('Optimistic concurrency error: The invoice has been modified by another transaction');
      }
      dbData.version = invoice.version;
      await dbClient.update(invoices).set(dbData).where(and(eq(invoices.id, invoice.id), eq(invoices.version, existing.version)));
    } else {
      dbData.version = invoice.version;
      await dbClient.insert(invoices).values(dbData);
    }`
  );
  
  fs.writeFileSync(file, code);
}

patchRepo('src/services/accounts-payable/infrastructure/AccountsPayableRepository.ts');
patchRepo('src/services/accounts-receivable/infrastructure/AccountsReceivableRepository.ts');
