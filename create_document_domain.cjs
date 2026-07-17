const fs = require('fs');
const path = require('path');

const files = {
  'src/services/document/domain/DocumentType.ts': `export enum DocumentType {
  LEAVE_REQUEST = 'LEAVE_REQUEST',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  INVOICE = 'INVOICE',
  EXPENSE_CLAIM = 'EXPENSE_CLAIM',
  GENERIC_DOCUMENT = 'GENERIC_DOCUMENT'
}
`,
  'src/services/document/domain/DocumentStatus.ts': `export enum DocumentStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}
`,
  'src/services/document/domain/BusinessDocumentDomainError.ts': `export class BusinessDocumentDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessDocumentDomainError';
  }
}
`,
  'src/services/document/domain/IDocumentNumberGenerator.ts': `import { DocumentType } from './DocumentType';

export interface IDocumentNumberGenerator {
  generate(type: DocumentType): Promise<string>;
}
`,
  'src/services/document/domain/BusinessDocument.ts': `import { DocumentType } from './DocumentType';
import { DocumentStatus } from './DocumentStatus';
import { BusinessDocumentDomainError } from './BusinessDocumentDomainError';

export interface BusinessDocumentProps {
  id: string;
  documentNumber: string;
  type: DocumentType;
  status: DocumentStatus;
  title: string;
  payload: Record<string, any>;
  creatorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BusinessDocument {
  private props: BusinessDocumentProps;

  constructor(props: BusinessDocumentProps) {
    this.props = props;
  }

  get id(): string { return this.props.id; }
  get documentNumber(): string { return this.props.documentNumber; }
  get type(): DocumentType { return this.props.type; }
  get status(): DocumentStatus { return this.props.status; }
  get title(): string { return this.props.title; }
  get payload(): Record<string, any> { return this.props.payload; }
  get creatorId(): string { return this.props.creatorId; }
  get createdAt(): Date { return this.props.createdAt; }
  get updatedAt(): Date { return this.props.updatedAt; }

  public updatePayload(newPayload: Record<string, any>): void {
    if (this.status !== DocumentStatus.DRAFT && this.status !== DocumentStatus.REJECTED) {
      throw new BusinessDocumentDomainError("Cannot update payload of a document that is not in DRAFT or REJECTED status.");
    }
    this.props.payload = { ...this.props.payload, ...newPayload };
    this.props.updatedAt = new Date();
  }

  public submit(): void {
    if (this.status !== DocumentStatus.DRAFT) {
      throw new BusinessDocumentDomainError("Only DRAFT documents can be submitted.");
    }
    this.props.status = DocumentStatus.SUBMITTED;
    this.props.updatedAt = new Date();
  }

  public markInReview(): void {
    if (this.status !== DocumentStatus.SUBMITTED) {
      throw new BusinessDocumentDomainError("Document must be SUBMITTED before it can be IN_REVIEW.");
    }
    this.props.status = DocumentStatus.IN_REVIEW;
    this.props.updatedAt = new Date();
  }

  public approve(): void {
    if (this.status !== DocumentStatus.IN_REVIEW && this.status !== DocumentStatus.SUBMITTED) {
      throw new BusinessDocumentDomainError("Document must be IN_REVIEW or SUBMITTED to be approved.");
    }
    this.props.status = DocumentStatus.APPROVED;
    this.props.updatedAt = new Date();
  }

  public reject(): void {
    if (this.status !== DocumentStatus.IN_REVIEW && this.status !== DocumentStatus.SUBMITTED) {
      throw new BusinessDocumentDomainError("Document must be IN_REVIEW or SUBMITTED to be rejected.");
    }
    this.props.status = DocumentStatus.REJECTED;
    this.props.updatedAt = new Date();
  }

  public cancel(): void {
    if (this.status === DocumentStatus.APPROVED || this.status === DocumentStatus.COMPLETED) {
      throw new BusinessDocumentDomainError("Cannot cancel an APPROVED or COMPLETED document.");
    }
    this.props.status = DocumentStatus.CANCELLED;
    this.props.updatedAt = new Date();
  }

  public complete(): void {
    if (this.status !== DocumentStatus.APPROVED) {
      throw new BusinessDocumentDomainError("Only APPROVED documents can be completed.");
    }
    this.props.status = DocumentStatus.COMPLETED;
    this.props.updatedAt = new Date();
  }
}
`,
  'src/services/document/domain/IBusinessDocumentRepository.ts': `import { BusinessDocument } from './BusinessDocument';

export interface IBusinessDocumentRepository {
  findById(id: string): Promise<BusinessDocument | null>;
  findByNumber(documentNumber: string): Promise<BusinessDocument | null>;
  save(document: BusinessDocument): Promise<void>;
  update(document: BusinessDocument): Promise<void>;
  delete(id: string): Promise<void>;
}
`,
  'src/services/document/domain/BusinessDocumentValidator.ts': `import { DocumentType } from './DocumentType';
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
`,
  'src/services/document/domain/BusinessDocumentFactory.ts': `import { BusinessDocument } from './BusinessDocument';
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
`,
  'src/services/document/application/BusinessDocumentApplicationService.ts': `import { IBusinessDocumentRepository } from '../domain/IBusinessDocumentRepository';
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
    if (!document) throw new BusinessDocumentDomainError(\`Document \${id} not found.\`);
    
    document.submit();
    await this.repository.update(document);
  }

  public async approveDocument(id: string): Promise<void> {
    const document = await this.repository.findById(id);
    if (!document) throw new BusinessDocumentDomainError(\`Document \${id} not found.\`);
    
    document.approve();
    await this.repository.update(document);
  }

  public async rejectDocument(id: string): Promise<void> {
    const document = await this.repository.findById(id);
    if (!document) throw new BusinessDocumentDomainError(\`Document \${id} not found.\`);
    
    document.reject();
    await this.repository.update(document);
  }

  public async updateDocumentPayload(id: string, newPayload: Record<string, any>): Promise<void> {
    const document = await this.repository.findById(id);
    if (!document) throw new BusinessDocumentDomainError(\`Document \${id} not found.\`);
    
    document.updatePayload(newPayload);
    await this.repository.update(document);
  }
}
`,
  'src/services/document/application/BusinessDocumentQueryService.ts': `import { IBusinessDocumentRepository } from '../domain/IBusinessDocumentRepository';
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
`,
  'src/services/document/infrastructure/BusinessDocumentMapper.ts': `import { BusinessDocument } from '../domain/BusinessDocument';

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
`
};

for (const [filepath, content] of Object.entries(files)) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content);
}
console.log('Files created successfully');
