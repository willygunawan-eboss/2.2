import { BusinessDocument } from './BusinessDocument';
import { DocumentType } from './DocumentType';
import { DocumentStatus } from './DocumentStatus';
import { BusinessDocumentValidator } from './BusinessDocumentValidator';
import { IDocumentNumberGenerator } from './IDocumentNumberGenerator';

export class BusinessDocumentFactory {
  constructor(private documentNumberGenerator: IDocumentNumberGenerator) {}

  public async create(
    id: string,
    type: DocumentType,
    title: string,
    payload: Record<string, any>,
    creatorId: string
  ): Promise<BusinessDocument> {
    BusinessDocumentValidator.validateCreation(type, title, creatorId);

    const documentNumber = await this.documentNumberGenerator.generate(type);
    
    return new BusinessDocument({
      id,
      documentNumber,
      type,
      status: DocumentStatus.DRAFT,
      title,
      payload,
      creatorId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  public reconstitute(props: any): BusinessDocument {
    return new BusinessDocument(props);
  }
}
