const fs = require('fs');
let code = fs.readFileSync('src/services/accounts-receivable/infrastructure/AccountsReceivableRepository.ts', 'utf8');

code = code.replace('unitPrice: item.unitPrice || 0,', 'unitPrice: item.price || 0,');
code = code.replace('taxAmount: item.taxAmount || 0,', 'taxAmount: 0, // Simplified\n');

fs.writeFileSync('src/services/accounts-receivable/infrastructure/AccountsReceivableRepository.ts', code);
