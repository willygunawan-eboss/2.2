import { IBusinessDocumentRepository } from '../domain/IBusinessDocumentRepository';
import { BusinessDocumentFactory } from '../domain/BusinessDocumentFactory';
import { DocumentType } from '../domain/DocumentType';
import { BusinessDocumentDomainError } from '../domain/BusinessDocumentDomainError';
import { v4 as uuidv4 } from 'uuid';

export class BusinessDocumentApplicationService {
  constructor(
    private repository: IBusinessDocumentRepository,
    private factory: BusinessDocumentFactory
  ) {}

  public async createDocument(command: {
    type: DocumentType;
    title: string;
    payload: Record<string, any>;
    creatorId: string;
  }): Promise<string> {
    const id = uuidv4();
    const document = await this.factory.create(
      id,
      command.type,
      command.title,
      command.payload,
      command.creatorId
    );

    await this.repository.save(document);
    return id;
  }

  public async submitDocument(id: string): Promise<void> {
    const document = await this.repository.findById(id);
    if (!document) throw new BusinessDocumentDomainError(`Document ${id} not found.`);
    
    document.submit();
    await this.repository.update(document);
  }

  public async approveDocument(id: string): Promise<void> {
    const document = await this.repository.findById(id);
    if (!document) throw new BusinessDocumentDomainError(`Document ${id} not found.`);
    
    document.approve();
    await this.repository.update(document);
  }

  public async rejectDocument(id: string): Promise<void> {
    const document = await this.repository.findById(id);
    if (!document) throw new BusinessDocumentDomainError(`Document ${id} not found.`);
    
    document.reject();
    await this.repository.update(document);
  }

  public async updateDocumentPayload(id: string, newPayload: Record<string, any>): Promise<void> {
    const document = await this.repository.findById(id);
    if (!document) throw new BusinessDocumentDomainError(`Document ${id} not found.`);
    
    document.updatePayload(newPayload);
    await this.repository.update(document);
  }
}
