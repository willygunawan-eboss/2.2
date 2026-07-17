export interface CreatePositionDTO {
  code: string;
  name: string;
  companyId?: string | null;
  jobId?: string | null;
  employmentType?: string | null;
  effectiveDate: string;
}

export interface UpdatePositionDTO {
  name: string;
  jobId?: string | null;
  employmentType?: string | null;
}

export interface PositionResponseDTO {
  id: string;
  code: string;
  name: string;
  companyId: string | null;
  jobId: string | null;
  employmentType: string | null;
  status: string;
  effectiveDate: string;
  isActive: boolean;
}
