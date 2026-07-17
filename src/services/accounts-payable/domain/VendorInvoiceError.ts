export class VendorInvoiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VendorInvoiceError';
  }
}
