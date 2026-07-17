const fs = require('fs');
let code = fs.readFileSync('src/services/accounts-receivable/domain/CustomerInvoice.ts', 'utf8');
if (!code.includes('version?: number;')) {
  code = code.replace(
    'lines: CustomerInvoiceLine[];',
    'lines: CustomerInvoiceLine[];\n  version?: number;'
  );
  code = code.replace(
    'public getTotalAmount(): number {',
    'get version(): number { return this.props.version || 1; }\n  public incrementVersion(): void { this.props.version = this.version + 1; }\n\n  public getTotalAmount(): number {'
  );
  fs.writeFileSync('src/services/accounts-receivable/domain/CustomerInvoice.ts', code);
}
