import { CreatePositionDTO, UpdatePositionDTO } from "../dto/PositionDTO.js";

export class PositionValidator {
  static validateCreate(dto: CreatePositionDTO) {
    if (!dto.code || dto.code.trim().length === 0) throw new Error("Position code is required");
    if (!dto.name || dto.name.trim().length === 0) throw new Error("Position name is required");
    if (!dto.effectiveDate) throw new Error("Effective Date is required");
  }

  static validateUpdate(dto: UpdatePositionDTO) {
    if (!dto.name || dto.name.trim().length === 0) throw new Error("Position name is required");
  }
}
