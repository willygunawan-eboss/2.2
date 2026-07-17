export interface CreateOrganizationDTO {
  code: string;
  name: string;
  type: string;
  parentId?: string | null;
}

export interface UpdateOrganizationDTO {
  id: string;
  code?: string;
  name?: string;
  type?: string;
  parentId?: string | null;
  isActive?: boolean;
}

export interface OrganizationResponseDTO {
  id: string;
  code: string;
  name: string;
  type: string;
  level: number;
  parentId: string | null;
  path: string | null;
  isActive: boolean;
  version: number;
}
