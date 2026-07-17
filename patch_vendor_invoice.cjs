const fs = require('fs');
let code = fs.readFileSync('src/services/accounts-payable/domain/VendorInvoice.ts', 'utf8');
if (!code.includes('version?: number;')) {
  code = code.replace(
    'lines: VendorInvoiceLine[];',
    'lines: VendorInvoiceLine[];\n  version?: number;'
  );
  code = code.replace(
    'public getOutstandingBalance(): number {',
    'get version(): number { return this.props.version || 1; }\n  public incrementVersion(): void { this.props.version = this.version + 1; }\n\n  public getOutstandingBalance(): number {'
  );
  fs.writeFileSync('src/services/accounts-payable/domain/VendorInvoice.ts', code);
}
