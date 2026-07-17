export class CustomerReceiptError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerReceiptError';
  }
}
