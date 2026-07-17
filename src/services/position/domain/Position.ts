import { v4 as uuidv4 } from 'uuid';
import { PositionCode, PositionName, PositionStatus, PlatformStatus } from "./ValueObjects.js";

export interface PositionProps {
  id: string;
  code: PositionCode;
  name: PositionName;
  companyId: string | null;
  jobId: string | null;
  employmentType: string | null;
  status: PositionStatus;
  effectiveDate: string;
  platformStatus: PlatformStatus;
  version: number;
}

export class Position {
  private props: PositionProps;

  private constructor(props: PositionProps) {
    this.props = props;
  }

  public static create(
    id: string | null,
    codeStr: string,
    nameStr: string,
    companyId: string | null,
    jobId: string | null,
    employmentType: string | null,
    statusStr: string,
    effectiveDate: string,
    isActive: boolean = true,
    isDeleted: boolean = false,
    version: number = 1
  ): Position {
    const props: PositionProps = {
      id: id || uuidv4(),
      code: PositionCode.create(codeStr),
      name: PositionName.create(nameStr),
      companyId,
      jobId,
      employmentType,
      status: PositionStatus.create(statusStr),
      effectiveDate,
      platformStatus: PlatformStatus.create(isActive, isDeleted),
      version
    };

    return new Position(props);
  }

  // Getters
  get id(): string { return this.props.id; }
  get code(): string { return this.props.code.value; }
  get name(): string { return this.props.name.value; }
  get companyId(): string | null { return this.props.companyId; }
  get jobId(): string | null { return this.props.jobId; }
  get employmentType(): string | null { return this.props.employmentType; }
  get status(): string { return this.props.status.value; }
  get effectiveDate(): string { return this.props.effectiveDate; }
  get isActive(): boolean { return this.props.platformStatus.isActive; }
  get isDeleted(): boolean { return this.props.platformStatus.isDeleted; }
  get version(): number { return this.props.version; }

  // Business logic methods
  public updateDetails(name: string, jobId: string | null, employmentType: string | null) {
    this.props.name = PositionName.create(name);
    this.props.jobId = jobId;
    this.props.employmentType = employmentType;
  }

  public changeStatus(newStatus: string) {
    this.props.status = PositionStatus.create(newStatus);
  }

  public deactivate() {
    this.props.platformStatus = PlatformStatus.create(false, this.props.platformStatus.isDeleted);
    this.props.status = PositionStatus.create("INACTIVE");
  }

  public activate() {
    this.props.platformStatus = PlatformStatus.create(true, this.props.platformStatus.isDeleted);
    this.props.status = PositionStatus.create("ACTIVE");
  }

  public markAsDeleted() {
    this.props.platformStatus = PlatformStatus.create(this.props.platformStatus.isActive, true);
  }

  public incrementVersion() {
    this.props.version++;
  }
}
