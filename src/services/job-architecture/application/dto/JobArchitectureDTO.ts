export interface CreateJobFamilyDTO {
  code: string;
  name: string;
  description?: string | null;
}

export interface UpdateJobFamilyDTO {
  name?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface JobFamilyDTO {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface CreateJobGradeDTO {
  code: string;
  name: string;
  level: number;
  description?: string | null;
}

export interface UpdateJobGradeDTO {
  name?: string;
  level?: number;
  description?: string | null;
  isActive?: boolean;
}

export interface JobGradeDTO {
  id: string;
  code: string;
  name: string;
  level: number;
  description: string | null;
  isActive: boolean;
}

export interface CreateJobDTO {
  code: string;
  name: string;
  jobFamilyId: string;
  jobGradeId: string;
  description?: string | null;
}

export interface UpdateJobDTO {
  name?: string;
  jobFamilyId?: string;
  jobGradeId?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface JobDTO {
  id: string;
  code: string;
  name: string;
  jobFamilyId: string;
  jobGradeId: string;
  description: string | null;
  isActive: boolean;
}
