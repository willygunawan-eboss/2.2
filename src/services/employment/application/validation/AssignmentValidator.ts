import { CreateAssignmentDTO } from "../dto/AssignmentDTO.js";

export class AssignmentValidator {
  static validateCreate(dto: CreateAssignmentDTO) {
    if (!dto.employmentId) throw new Error("Employment ID is required");
    if (!dto.organizationId) throw new Error("Organization ID is required");
    if (!dto.positionId) throw new Error("Position ID is required");
    if (!dto.effectiveDate) throw new Error("Effective Date is required");
  }
}
