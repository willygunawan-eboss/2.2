const fs = require('fs');
let code = fs.readFileSync('src/services/accounts-payable/application/ReconcileAPPaymentUseCase.ts', 'utf8');

code = code.replace(
  'command: { invoiceId: string, vendorId: string, amount: number, paymentDate: string, currencyId: string, referenceNumber: string }',
  'command: { invoiceId: string, vendorId: string, amount: number, paymentDate: string, currencyId: string, referenceNumber: string, cashAccountId: string }'
);

code = code.replace(
  'command.referenceNumber',
  'command.referenceNumber,\n        command.cashAccountId'
);

fs.writeFileSync('src/services/accounts-payable/application/ReconcileAPPaymentUseCase.ts', code);
