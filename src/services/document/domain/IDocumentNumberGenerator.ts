import { DocumentType } from './DocumentType';

export interface IDocumentNumberGenerator {
  generate(type: DocumentType): Promise<string>;
}
