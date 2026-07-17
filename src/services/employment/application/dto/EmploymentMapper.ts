import { Employment } from "../../domain/Employment.js";
import { EmploymentResponseDTO } from "./EmploymentDTO.js";

export class EmploymentMapper {
  static toDTO(domain: Employment): EmploymentResponseDTO {
    return {
      id: domain.id,
      employeeNumber: domain.employeeNumber,
      fullName: domain.fullName,
      organizationId: domain.organizationId,
      employmentType: domain.employmentType,
      status: domain.status,
      joinDate: domain.joinDate,
      terminationDate: domain.terminationDate,
      isActive: domain.isActive,
      version: domain.version
    };
  }
}
