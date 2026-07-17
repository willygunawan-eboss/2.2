export interface PromoteEmployeeDTO {
  employeeNumber: string;
  companyId: string;
  newOrganizationId: string;
  newPositionId: string;
  newJobGradeId?: string;
  effectiveDate: string;
  reason: string;
  actor: string;
}
