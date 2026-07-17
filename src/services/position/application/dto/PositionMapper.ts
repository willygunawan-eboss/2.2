import { Position } from "../../domain/Position.js";
import { PositionResponseDTO } from "./PositionDTO.js";

export class PositionMapper {
  static toDTO(domain: Position): PositionResponseDTO {
    return {
      id: domain.id,
      code: domain.code,
      name: domain.name,
      companyId: domain.companyId,
      jobId: domain.jobId,
      employmentType: domain.employmentType,
      status: domain.status,
      effectiveDate: domain.effectiveDate,
      isActive: domain.isActive
    };
  }
}
