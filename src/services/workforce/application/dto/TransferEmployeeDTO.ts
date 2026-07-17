export interface TransferEmployeeDTO {
  employeeNumber: string;
  companyId: string;
  newOrganizationId: string;
  newPositionId: string;
  effectiveDate: string;
  reason: string;
  actor: string;
}
