export interface CreateEmploymentDTO {
  employeeNumber: string;
  fullName: string;
  organizationId?: string | null;
  employmentType: string;
  status: string;
  joinDate: string;
}

export interface UpdateEmploymentDTO {
  id: string;
  employeeNumber?: string;
  fullName?: string;
  organizationId?: string | null;
  employmentType?: string;
  status?: string;
  joinDate?: string;
  isActive?: boolean;
}

export interface EmploymentResponseDTO {
  id: string;
  employeeNumber: string;
  fullName: string;
  organizationId: string | null;
  employmentType: string;
  status: string;
  joinDate: string;
  terminationDate: string | null;
  isActive: boolean;
  version: number;
}
