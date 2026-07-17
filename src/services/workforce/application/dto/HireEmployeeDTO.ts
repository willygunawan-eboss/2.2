export interface HireEmployeeDTO {
  employeeNumber: string;
  name: string;
  email?: string;
  nationalIdentityNumber?: string;
  companyId: string;
  branchId: string;
  divisionId: string;
  departmentId: string;
  jobGradeId: string;
  employmentType: string;
  employmentStatus: string;
  organizationId: string;
  positionId: string;
  effectiveDate: string;
  contractStartDate?: string;
  actor: string;
}
