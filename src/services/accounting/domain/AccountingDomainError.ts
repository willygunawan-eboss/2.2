export class AccountingDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccountingDomainError';
  }
}
