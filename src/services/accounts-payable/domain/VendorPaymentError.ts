export class VendorPaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VendorPaymentError';
  }
}
