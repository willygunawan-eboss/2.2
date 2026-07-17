export class PostingDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PostingDomainError';
  }
}
