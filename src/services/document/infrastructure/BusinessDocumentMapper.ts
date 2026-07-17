import { BusinessDocument } from '../domain/BusinessDocument';

export class BusinessDocumentMapper {
  public static toDomain(raw: any): BusinessDocument {
    return new BusinessDocument({
      id: raw.id,
      documentNumber: raw.document_number || raw.documentNumber,
      type: raw.type,
      status: raw.status,
      title: raw.title,
      payload: typeof raw.payload === 'string' ? JSON.parse(raw.payload) : raw.payload,
      creatorId: raw.creator_id || raw.creatorId,
      createdAt: new Date(raw.created_at || raw.createdAt),
      updatedAt: new Date(raw.updated_at || raw.updatedAt),
    });
  }

  public static toPersistence(domain: BusinessDocument): any {
    return {
      id: domain.id,
      document_number: domain.documentNumber,
      type: domain.type,
      status: domain.status,
      title: domain.title,
      payload: JSON.stringify(domain.payload),
      creator_id: domain.creatorId,
      created_at: domain.createdAt.toISOString(),
      updated_at: domain.updatedAt.toISOString(),
    };
  }
}
