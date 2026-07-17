export interface CreateAssignmentDTO {
  employmentId: string;
  organizationId: string;
  positionId: string;
  managerId?: string | null;
  supervisorId?: string | null;
  effectiveDate: string;
}

export interface TerminateAssignmentDTO {
  endDate: string;
}

export interface AssignmentResponseDTO {
  id: string;
  employmentId: string;
  organizationId: string;
  positionId: string;
  managerId: string | null;
  supervisorId: string | null;
  effectiveDate: string;
  endDate: string | null;
  status: string;
  isActive: boolean;
}
