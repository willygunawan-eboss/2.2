export class VendorCreditNoteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'VendorCreditNoteError';
  }
}
