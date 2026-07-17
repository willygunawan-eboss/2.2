import { IEmploymentRepository } from "../repository/IEmploymentRepository.js";
import { EmploymentMapper } from "./dto/EmploymentMapper.js";
import { EmploymentNotFoundError } from "../domain/EmploymentErrors.js";
import { EmploymentResponseDTO } from "./dto/EmploymentDTO.js";

export class EmploymentQueryService {
  constructor(private readonly repository: IEmploymentRepository) {}

  async getById(id: string): Promise<EmploymentResponseDTO> {
    const emp = await this.repository.findById(id);
    if (!emp) {
      throw new EmploymentNotFoundError(id);
    }
    return EmploymentMapper.toDTO(emp);
  }

  async getByEmployeeNumber(employeeNumber: string): Promise<EmploymentResponseDTO> {
    const emp = await this.repository.findByEmployeeNumber(employeeNumber);
    if (!emp) {
      throw new Error(`Employment with employee number ${employeeNumber} not found.`);
    }
    return EmploymentMapper.toDTO(emp);
  }

  async search(query: any): Promise<{ data: any[], pagination: any }> {
    return this.repository.search(query);
  }
}
