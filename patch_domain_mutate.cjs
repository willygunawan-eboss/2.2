const fs = require('fs');
const file = 'src/services/workforce/domain/WorkforceDomainService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `  public static validateHire(`,
  `  public static validateMutation(
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

  public static validateHire(`
);

fs.writeFileSync(file, code);

// MutateEmployeeDTO
const dtoFile = 'src/services/workforce/application/dto/MutateEmployeeDTO.ts';
fs.writeFileSync(dtoFile, `
export interface MutateEmployeeDTO {
  employeeNumber: string;
  companyId: string;
  newOrganizationId: string;
  newPositionId: string;
  effectiveDate: string;
  reason: string;
  actor: string;
}
`);
