import { Organization } from "../domain/Organization.js";
import { OrganizationResponseDTO } from "./OrganizationDTO.js";

export class OrganizationMapper {
  static toDTO(org: Organization): OrganizationResponseDTO {
    return {
      id: org.id,
      code: org.code,
      name: org.name,
      type: org.type,
      level: org.level,
      parentId: org.parentId,
      path: org.path,
      isActive: org.isActive,
      version: org.version
    };
  }
}
