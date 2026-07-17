import { v4 as uuidv4 } from 'uuid';
import { AssignmentStatus } from "./AssignmentValueObjects.js";
import { PlatformStatus } from "./ValueObjects.js";
import { InvalidAssignmentDateError, InvalidAssignmentReferenceError } from "./AssignmentErrors.js";

export interface AssignmentProps {
  id: string;
  employmentId: string;
  organizationId: string;
  positionId: string;
  managerId: string | null;
  supervisorId: string | null;
  effectiveDate: string;
  endDate: string | null;
  status: AssignmentStatus;
  platformStatus: PlatformStatus;
  version: number;
}

export class Assignment {
  private props: AssignmentProps;

  private constructor(props: AssignmentProps) {
    this.props = props;
  }

  public static create(
    id: string | null,
    employmentId: string,
    organizationId: string,
    positionId: string,
    managerId: string | null,
    supervisorId: string | null,
    effectiveDate: string,
    endDate: string | null = null,
    statusStr: string = "ACTIVE",
    isActive: boolean = true,
    isDeleted: boolean = false,
    version: number = 1
  ): Assignment {
    if (!employmentId) throw new InvalidAssignmentReferenceError("Employment ID is required");
    if (!organizationId) throw new InvalidAssignmentReferenceError("Organization ID is required");
    if (!positionId) throw new InvalidAssignmentReferenceError("Position ID is required");
    if (!effectiveDate) throw new InvalidAssignmentDateError("Effective date is required");

    if (endDate && new Date(effectiveDate) >= new Date(endDate)) {
      throw new InvalidAssignmentDateError("Effective date must be before end date");
    }

    const props: AssignmentProps = {
      id: id || uuidv4(),
      employmentId,
      organizationId,
      positionId,
      managerId,
      supervisorId,
      effectiveDate,
      endDate,
      status: AssignmentStatus.create(statusStr),
      platformStatus: PlatformStatus.create(isActive, isDeleted),
      version
    };

    return new Assignment(props);
  }

  get id(): string { return this.props.id; }
  get employmentId(): string { return this.props.employmentId; }
  get organizationId(): string { return this.props.organizationId; }
  get positionId(): string { return this.props.positionId; }
  get managerId(): string | null { return this.props.managerId; }
  get supervisorId(): string | null { return this.props.supervisorId; }
  get effectiveDate(): string { return this.props.effectiveDate; }
  get endDate(): string | null { return this.props.endDate; }
  get status(): string { return this.props.status.value; }
  get isActive(): boolean { return this.props.platformStatus.isActive; }
  get isDeleted(): boolean { return this.props.platformStatus.isDeleted; }
  get version(): number { return this.props.version; }

  public terminate(endDate: string) {
    if (new Date(this.props.effectiveDate) >= new Date(endDate)) {
      throw new InvalidAssignmentDateError("End date must be after effective date");
    }
    this.props.endDate = endDate;
    this.props.status = AssignmentStatus.create("INACTIVE");
  }

  public incrementVersion() {
    this.props.version++;
  }
}
