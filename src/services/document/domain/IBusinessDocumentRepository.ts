import { BusinessDocument } from './BusinessDocument';

export interface IBusinessDocumentRepository {
  findById(id: string): Promise<BusinessDocument | null>;
  findByNumber(documentNumber: string): Promise<BusinessDocument | null>;
  save(document: BusinessDocument): Promise<void>;
  update(document: BusinessDocument): Promise<void>;
  delete(id: string): Promise<void>;
}
