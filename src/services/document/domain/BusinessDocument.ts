import { DocumentType } from './DocumentType';
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
