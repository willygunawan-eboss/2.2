const fs = require('fs');
const file = 'src/services/workforce/domain/WorkforceDomainService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  'export class WorkforceDomainService {',
  `export class WorkforceDomainService {
  public static validateTransfer(
    employee: any,
    currentAssignment: Assignment | null,
    newOrganization: Organization | null,
    newPosition: Position | null,
    effectiveDate: string
  ) {
    if (!employee) throw new Error("Employee not found");
    if (employee.status !== 'Active') throw new Error("Employee is not active");
    if (!currentAssignment) throw new Error("Active assignment not found");
    
    if (new Date(effectiveDate) <= new Date(currentAssignment.effectiveDate)) {
      throw new Error("Transfer effective date must be after current assignment effective date");
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
`
);
fs.writeFileSync(file, code);
