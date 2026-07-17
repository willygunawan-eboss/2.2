import { IOrganizationRepository } from "../repository/IOrganizationRepository.js";
import { OrganizationSearchQueryDTO } from "../dto/OrganizationQueryDTO.js";

export class OrganizationQueryService {
  constructor(private readonly repository: IOrganizationRepository) {}

  async getTree(): Promise<any[]> {
    return this.repository.getTree();
  }

  async search(query: OrganizationSearchQueryDTO): Promise<{ data: any[], pagination: any }> {
    return this.repository.search(query);
  }
}
