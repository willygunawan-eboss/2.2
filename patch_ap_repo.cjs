const fs = require('fs');
let code = fs.readFileSync('src/services/accounts-payable/infrastructure/AccountsPayableRepository.ts', 'utf8');

code = code.replace('unitPrice: item.unitPrice || 0,', 'unitPrice: item.price || 0,');
code = code.replace('taxAmount: item.taxAmount || 0,', 'taxAmount: 0, // Simplified for now since invoiceItems schema lacks taxAmount\n');

fs.writeFileSync('src/services/accounts-payable/infrastructure/AccountsPayableRepository.ts', code);
