import { DocumentType } from './DocumentType';
import { BusinessDocumentDomainError } from './BusinessDocumentDomainError';

export class BusinessDocumentValidator {
  public static validateCreation(type: DocumentType, title: string, creatorId: string): void {
    if (!type) {
      throw new BusinessDocumentDomainError("Document type is required.");
    }
    if (!title || title.trim() === '') {
      throw new BusinessDocumentDomainError("Document title is required.");
    }
    if (!creatorId) {
      throw new BusinessDocumentDomainError("Creator ID is required.");
    }
  }
}
