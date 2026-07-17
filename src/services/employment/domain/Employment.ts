import {
  EmployeeNumber,
  FullName,
  EmploymentType,
  EmploymentStatus,
  PlatformStatus
} from "./ValueObjects.js";
import { v4 as uuidv4 } from 'uuid';
import { InvalidOrganizationError } from "./EmploymentErrors.js";

export interface EmploymentProps {
  id: string;
  employeeNumber: EmployeeNumber;
  fullName: FullName;
  organizationId: string | null;
  employmentType: EmploymentType;
  status: EmploymentStatus;
  joinDate: string;
  terminationDate: string | null;
  platformStatus: PlatformStatus;
  version: number;
}

export class Employment {
  private props: EmploymentProps;

  private constructor(props: EmploymentProps) {
    this.props = props;
  }

  public static create(
    id: string | null,
    employeeNumberStr: string,
    fullNameStr: string,
    organizationId: string | null,
    employmentTypeStr: string,
    statusStr: string,
    joinDateStr: string,
    terminationDateStr: string | null = null,
    isActive: boolean = true,
    isDeleted: boolean = false,
    version: number = 1
  ): Employment {
    const props: EmploymentProps = {
      id: id || uuidv4(),
      employeeNumber: EmployeeNumber.create(employeeNumberStr),
      fullName: FullName.create(fullNameStr),
      organizationId,
      employmentType: EmploymentType.create(employmentTypeStr),
      status: EmploymentStatus.create(statusStr),
      joinDate: joinDateStr,
      terminationDate: terminationDateStr,
      platformStatus: PlatformStatus.create(isActive, isDeleted),
      version
    };

    return new Employment(props);
  }

  // Getters
  get id(): string { return this.props.id; }
  get employeeNumber(): string { return this.props.employeeNumber.value; }
  get fullName(): string { return this.props.fullName.value; }
  get organizationId(): string | null { return this.props.organizationId; }
  get employmentType(): string { return this.props.employmentType.value; }
  get status(): string { return this.props.status.value; }
  get joinDate(): string { return this.props.joinDate; }
  get terminationDate(): string | null { return this.props.terminationDate; }
  get isActive(): boolean { return this.props.platformStatus.isActive; }
  get isDeleted(): boolean { return this.props.platformStatus.isDeleted; }
  get version(): number { return this.props.version; }

  // Business logic methods
  public updateFullName(newName: string) {
    this.props.fullName = FullName.create(newName);
  }

  public updateEmployeeNumber(newNumber: string) {
    this.props.employeeNumber = EmployeeNumber.create(newNumber);
  }

  public changeEmploymentType(newType: string) {
    this.props.employmentType = EmploymentType.create(newType);
  }

  public changeStatus(newStatus: string) {
    this.props.status = EmploymentStatus.create(newStatus);
  }

  public assignToOrganization(organizationId: string) {
    if (!organizationId) {
      throw new InvalidOrganizationError("Organization ID must be provided");
    }
    this.props.organizationId = organizationId;
  }

  public removeFromOrganization() {
    this.props.organizationId = null;
  }

  public terminate(date: string) {
    this.props.status = EmploymentStatus.create("TERMINATED");
    this.props.terminationDate = date;
    this.props.platformStatus = PlatformStatus.create(false, this.props.platformStatus.isDeleted);
  }

  public deactivate() {
    this.props.platformStatus = PlatformStatus.create(false, this.props.platformStatus.isDeleted);
  }

  public activate() {
    this.props.platformStatus = PlatformStatus.create(true, this.props.platformStatus.isDeleted);
  }

  public restore() {
    this.props.platformStatus = PlatformStatus.create(true, false);
  }

  public markAsDeleted() {
    this.props.platformStatus = PlatformStatus.create(this.props.platformStatus.isActive, true);
  }

  public incrementVersion() {
    this.props.version++;
  }
}
