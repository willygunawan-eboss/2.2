import { CreateOrganizationDTO, UpdateOrganizationDTO } from "../dto/OrganizationDTO.js";

export class OrganizationValidator {
  static validateCreate(dto: CreateOrganizationDTO) {
    const errors: string[] = [];
    if (!dto.code || dto.code.trim() === '') errors.push("Code is required");
    if (!dto.name || dto.name.trim() === '') errors.push("Name is required");
    if (!dto.type || dto.type.trim() === '') errors.push("Type is required");
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }

  static validateUpdate(dto: UpdateOrganizationDTO) {
    const errors: string[] = [];
    if (!dto.id || dto.id.trim() === '') errors.push("ID is required");
    
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
  }
}
