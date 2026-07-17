const fs = require('fs');
const file = 'src/services/workforce/domain/WorkforceDomainService.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `  public static createHireEntities(dto: any) {`,
  `  public static validateTermination(
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

  public static createHireEntities(dto: any) {`
);

fs.writeFileSync(file, code);
