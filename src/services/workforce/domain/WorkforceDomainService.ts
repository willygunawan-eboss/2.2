import { Organization } from "../../organization/domain/Organization";
import { Position } from "../../position/domain/Position";
import { Employment } from "../../employment/domain/Employment";
import { Assignment } from "../../employment/domain/Assignment";
import { 
  DuplicateEmployeeNumberError, 
  InactiveOrganizationError, 
  InactivePositionError,
  EmployeeNotFoundError,
  EmployeeNotActiveError,
  ActiveAssignmentNotFoundError,
  InvalidEffectiveDateError
} from "./WorkforceErrors";
import crypto from 'crypto';

export class WorkforceDomainService {
  public static validatePromotion(
    employee: any,
    currentAssignment: Assignment | null,
    newOrganization: Organization | null,
    newPosition: Position | null,
    effectiveDate: string
  ) {
    if (!employee) throw new EmployeeNotFoundError('UNKNOWN');
    if (employee.status !== 'Active') throw new EmployeeNotActiveError(employee.employeeNumber);
    if (!currentAssignment) throw new ActiveAssignmentNotFoundError(employee.employeeNumber);
    
    if (new Date(effectiveDate) <= new Date(currentAssignment.effectiveDate)) {
      throw new InvalidEffectiveDateError('Promotion effective date must be after current assignment effective date');
    }
    
    if (!newOrganization || !newOrganization.isActive || newOrganization.isDeleted) {
      throw new InactiveOrganizationError(newOrganization ? newOrganization.id : "UNKNOWN");
    }
    if (!newPosition || !newPosition.isActive || newPosition.isDeleted) {
      throw new InactivePositionError(newPosition ? newPosition.id : "UNKNOWN");
    }
    // Specific promotion rules could go here
  }

  public static processPromotion(
    currentAssignment: Assignment,
    newOrganizationId: string,
    newPositionId: string,
    effectiveDate: string
  ) {
    const oldEndDate = new Date(new Date(effectiveDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    currentAssignment.terminate(oldEndDate);

    const newAssignment = Assignment.create(
      crypto.randomUUID(),
      currentAssignment.employmentId,
      newOrganizationId,
      newPositionId,
      currentAssignment.managerId,
      currentAssignment.supervisorId,
      effectiveDate
    );
    return { updatedOldAssignment: currentAssignment, newAssignment };
  }

  public static validateTransfer(
    employee: any,
    currentAssignment: Assignment | null,
    newOrganization: Organization | null,
    newPosition: Position | null,
    effectiveDate: string
  ) {
    if (!employee) throw new EmployeeNotFoundError('UNKNOWN');
    if (employee.status !== 'Active') throw new EmployeeNotActiveError(employee.employeeNumber);
    if (!currentAssignment) throw new ActiveAssignmentNotFoundError(employee.employeeNumber);
    
    if (new Date(effectiveDate) <= new Date(currentAssignment.effectiveDate)) {
      throw new InvalidEffectiveDateError('Transfer effective date must be after current assignment effective date');
    }

    if (!newOrganization || !newOrganization.isActive || newOrganization.isDeleted) {
      throw new InactiveOrganizationError(newOrganization ? newOrganization.id : "UNKNOWN");
    }
    if (!newPosition || !newPosition.isActive || newPosition.isDeleted) {
      throw new InactivePositionError(newPosition ? newPosition.id : "UNKNOWN");
    }
  }

  public static processTransfer(
    currentAssignment: Assignment,
    newOrganizationId: string,
    newPositionId: string,
    effectiveDate: string
  ) {
    const oldEndDate = new Date(new Date(effectiveDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    currentAssignment.terminate(oldEndDate);

    const newAssignment = Assignment.create(
      crypto.randomUUID(),
      currentAssignment.employmentId,
      newOrganizationId,
      newPositionId,
      currentAssignment.managerId,
      currentAssignment.supervisorId,
      effectiveDate
    );

    return { updatedOldAssignment: currentAssignment, newAssignment };
  }

  public static validateMutation(
    employee: any,
    currentAssignment: Assignment | null,
    newOrganization: Organization | null,
    newPosition: Position | null,
    effectiveDate: string
  ) {
    if (!employee) throw new EmployeeNotFoundError('UNKNOWN');
    if (employee.status !== 'Active') throw new EmployeeNotActiveError(employee.employeeNumber);
    if (!currentAssignment) throw new ActiveAssignmentNotFoundError(employee.employeeNumber);
    
    if (new Date(effectiveDate) <= new Date(currentAssignment.effectiveDate)) {
      throw new InvalidEffectiveDateError('Mutation effective date must be after current assignment effective date');
    }
    if (!newOrganization || !newOrganization.isActive || newOrganization.isDeleted) {
      throw new InactiveOrganizationError(newOrganization ? newOrganization.id : "UNKNOWN");
    }
    if (!newPosition || !newPosition.isActive || newPosition.isDeleted) {
      throw new InactivePositionError(newPosition ? newPosition.id : "UNKNOWN");
    }
  }

  public static processMutation(
    currentAssignment: Assignment,
    newOrganizationId: string,
    newPositionId: string,
    effectiveDate: string
  ) {
    const oldEndDate = new Date(new Date(effectiveDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    currentAssignment.terminate(oldEndDate);
    const newAssignment = Assignment.create(
      crypto.randomUUID(),
      currentAssignment.employmentId,
      newOrganizationId,
      newPositionId,
      currentAssignment.managerId,
      currentAssignment.supervisorId,
      effectiveDate
    );
    return { updatedOldAssignment: currentAssignment, newAssignment };
  }

  public static validateHire(
    existingEmployeesWithNumber: any[],
    organization: Organization | null,
    position: Position | null,
    employeeNumber: string,
    organizationId: string,
    positionId: string
  ) {
    if (existingEmployeesWithNumber && existingEmployeesWithNumber.some((e: any) => e.employeeNumber === employeeNumber)) {
      throw new DuplicateEmployeeNumberError(employeeNumber);
    }
    
    if (!organization || !organization.isActive || organization.isDeleted) {
      throw new InactiveOrganizationError(organizationId);
    }

    if (!position || !position.isActive || position.isDeleted) {
      throw new InactivePositionError(positionId);
    }
  }

  public static validateTermination(
    employee: any,
    currentAssignment: Assignment | null,
    effectiveDate: string
  ) {
    if (!employee) throw new EmployeeNotFoundError('UNKNOWN');
    if (employee.status !== 'Active') throw new EmployeeNotActiveError(employee.employeeNumber);
    if (!currentAssignment) throw new ActiveAssignmentNotFoundError(employee.employeeNumber);
    
    if (new Date(effectiveDate) <= new Date(currentAssignment.effectiveDate)) {
      throw new InvalidEffectiveDateError('Termination effective date must be after current assignment effective date');
    }
  }

  public static processTermination(
    currentAssignment: Assignment,
    employment: Employment,
    effectiveDate: string
  ) {
    const oldEndDate = new Date(new Date(effectiveDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    currentAssignment.terminate(oldEndDate);
    employment.terminate(effectiveDate);
    return { updatedOldAssignment: currentAssignment, updatedEmployment: employment };
  }

  public static createHireEntities(dto: any) {
    const employeeId = crypto.randomUUID();
    const employmentId = crypto.randomUUID();
    const assignmentId = crypto.randomUUID();

    const employeeData = {
      id: employeeId,
      employeeNumber: dto.employeeNumber,
      name: dto.name,
      email: dto.email,
      nationalIdentityNumber: dto.nationalIdentityNumber,
      employmentStatus: dto.employmentStatus,
      hireDate: dto.effectiveDate,
      contractStartDate: dto.contractStartDate,
      createdBy: dto.actor,
      status: 'Active'
    };

    const employment = Employment.create(
      employmentId,
      dto.employeeNumber,
      dto.name,
      dto.organizationId,
      dto.employmentType,
      dto.employmentStatus,
      dto.effectiveDate
    );

    const assignment = Assignment.create(
      assignmentId,
      employmentId,
      dto.organizationId,
      dto.positionId,
      null,
      null,
      dto.effectiveDate
    );

    return { employeeData, employment, assignment };
  }
}
