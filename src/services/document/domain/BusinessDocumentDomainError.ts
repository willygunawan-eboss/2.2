export class BusinessDocumentDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessDocumentDomainError';
  }
}
