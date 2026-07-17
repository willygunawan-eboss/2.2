import { IAssignmentRepository } from "../repository/IAssignmentRepository.js";
import { AssignmentMapper } from "./dto/AssignmentMapper.js";
import { AssignmentNotFoundError } from "../domain/AssignmentErrors.js";
import { AssignmentResponseDTO } from "./dto/AssignmentDTO.js";

export class AssignmentQueryService {
  constructor(private readonly repository: IAssignmentRepository) {}

  async getById(id: string): Promise<AssignmentResponseDTO> {
    const assignment = await this.repository.findById(id);
    if (!assignment) {
      throw new AssignmentNotFoundError(id);
    }
    return AssignmentMapper.toDTO(assignment);
  }

  async getActiveByEmploymentId(employmentId: string): Promise<AssignmentResponseDTO | null> {
    const assignment = await this.repository.findActiveByEmploymentId(employmentId);
    if (!assignment) {
      return null;
    }
    return AssignmentMapper.toDTO(assignment);
  }

  async getHistoryByEmploymentId(employmentId: string): Promise<AssignmentResponseDTO[]> {
    const assignments = await this.repository.findByEmploymentId(employmentId);
    return assignments.map(a => AssignmentMapper.toDTO(a));
  }

  async search(query: any): Promise<{ data: any[], pagination: any }> {
    return this.repository.search(query);
  }
}
