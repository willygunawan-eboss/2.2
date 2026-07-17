import { IPositionRepository } from "../repository/IPositionRepository.js";
import { PositionMapper } from "./dto/PositionMapper.js";
import { PositionNotFoundError } from "../domain/PositionErrors.js";
import { PositionResponseDTO } from "./dto/PositionDTO.js";

export class PositionQueryService {
  constructor(private readonly repository: IPositionRepository) {}

  async getById(id: string): Promise<PositionResponseDTO> {
    const position = await this.repository.findById(id);
    if (!position || position.isDeleted) {
      throw new PositionNotFoundError(id);
    }
    return PositionMapper.toDTO(position);
  }

  async getByCode(code: string): Promise<PositionResponseDTO> {
    const position = await this.repository.findByCode(code);
    if (!position || position.isDeleted) {
      throw new Error(`Position with code ${code} not found`);
    }
    return PositionMapper.toDTO(position);
  }

  async search(query: any): Promise<{ data: any[], pagination: any }> {
    return this.repository.search(query);
  }
}
