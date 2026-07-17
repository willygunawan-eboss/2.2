const fs = require('fs');

function addLocking(file) {
  let code = fs.readFileSync(file, 'utf8');
  
  if (code.includes('// Optimistic locking enforced')) return; // Already there
  
  // Find saveInvoice method
  const replaceTarget = `await dbClient.insert(invoices).values(dbData)
      .onConflictDoUpdate({ target: invoices.id, set: dbData });`;
      
  const replacement = `// Optimistic locking enforced
    const existing = await dbClient.select({ version: invoices.version }).from(invoices).where(eq(invoices.id, invoice.id)).get();
    
    if (existing) {
      if (invoice.version && invoice.version < existing.version) {
        throw new Error('Optimistic concurrency error: The invoice has been modified by another transaction');
      }
      dbData.version = (existing.version || 0) + 1;
      await dbClient.update(invoices).set(dbData).where(and(eq(invoices.id, invoice.id), eq(invoices.version, existing.version)));
    } else {
      dbData.version = 1;
      await dbClient.insert(invoices).values(dbData);
    }`;

  if (code.includes(replaceTarget)) {
    code = code.replace(replaceTarget, replacement);
    fs.writeFileSync(file, code);
    console.log("Updated", file);
  }
}

addLocking('src/services/accounts-payable/infrastructure/AccountsPayableRepository.ts');
addLocking('src/services/accounts-receivable/infrastructure/AccountsReceivableRepository.ts');
