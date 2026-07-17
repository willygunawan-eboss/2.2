import { Assignment } from "../../domain/Assignment.js";
import { AssignmentResponseDTO } from "./AssignmentDTO.js";

export class AssignmentMapper {
  static toDTO(domain: Assignment): AssignmentResponseDTO {
    return {
      id: domain.id,
      employmentId: domain.employmentId,
      organizationId: domain.organizationId,
      positionId: domain.positionId,
      managerId: domain.managerId,
      supervisorId: domain.supervisorId,
      effectiveDate: domain.effectiveDate,
      endDate: domain.endDate,
      status: domain.status,
      isActive: domain.isActive
    };
  }
}
