import { IBusinessDocumentRepository } from '../domain/IBusinessDocumentRepository';
import { BusinessDocument } from '../domain/BusinessDocument';

// In a real CQRS setup, QueryService might bypass Repository and read directly from DB/Views
export class BusinessDocumentQueryService {
  constructor(private repository: IBusinessDocumentRepository) {}

  public async getDocumentById(id: string): Promise<any> {
    const document = await this.repository.findById(id);
    if (!document) return null;
    return this.mapToDTO(document);
  }

  public async getDocumentByNumber(documentNumber: string): Promise<any> {
    const document = await this.repository.findByNumber(documentNumber);
    if (!document) return null;
    return this.mapToDTO(document);
  }

  private mapToDTO(document: BusinessDocument): any {
    return {
      id: document.id,
      documentNumber: document.documentNumber,
      type: document.type,
      status: document.status,
      title: document.title,
      payload: document.payload,
      creatorId: document.creatorId,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    };
  }
}
