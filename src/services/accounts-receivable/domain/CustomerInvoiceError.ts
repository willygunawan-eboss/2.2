export class CustomerInvoiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerInvoiceError';
  }
}
