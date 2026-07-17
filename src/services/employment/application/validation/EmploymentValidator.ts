import { CreateEmploymentDTO, UpdateEmploymentDTO } from "../dto/EmploymentDTO.js";

export class EmploymentValidator {
  static validateCreate(dto: CreateEmploymentDTO) {
    if (!dto.employeeNumber || dto.employeeNumber.trim().length === 0) {
      throw new Error("EmployeeNumber is required");
    }
    if (!dto.fullName || dto.fullName.trim().length === 0) {
      throw new Error("FullName is required");
    }
    if (!dto.employmentType || dto.employmentType.trim().length === 0) {
      throw new Error("EmploymentType is required");
    }
    if (!dto.status || dto.status.trim().length === 0) {
      throw new Error("Status is required");
    }
    if (!dto.joinDate || dto.joinDate.trim().length === 0) {
      throw new Error("JoinDate is required");
    }
  }

  static validateUpdate(dto: UpdateEmploymentDTO) {
    if (!dto.id) {
      throw new Error("Employment ID is required");
    }
  }
}
