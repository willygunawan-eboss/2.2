import { IOrganizationRepository } from "../repository/IOrganizationRepository.js";
import { Organization } from "../domain/Organization.js";
import { CreateOrganizationDTO, UpdateOrganizationDTO, OrganizationResponseDTO } from "../dto/OrganizationDTO.js";
import { OrganizationMapper } from "../dto/OrganizationMapper.js";
import { OrganizationNotFoundError, InvalidOrganizationCodeError } from "../domain/OrganizationErrors.js";
import { OrganizationBusinessEngine } from "../OrganizationEngine.js";

export class OrganizationApplicationService {
  constructor(private readonly repository: IOrganizationRepository) {}

  async createOrganization(dto: CreateOrganizationDTO): Promise<OrganizationResponseDTO> {
    // 1. Validation: check if code exists
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw new InvalidOrganizationCodeError(`Organization with code ${dto.code} already exists`);
    }

    // 2. Create Aggregate
    const org = Organization.create(
      null, 
      dto.code, 
      dto.name, 
      dto.type, 
      dto.parentId || null
    );

    // 3. Resolve Hierarchy
    if (dto.parentId) {
      const parent = await this.repository.findById(dto.parentId);
      if (!parent) {
        throw new OrganizationNotFoundError(dto.parentId);
      }
      org.setHierarchy(parent);
    } else {
      org.setHierarchy(null);
    }

    // 4. Persist
    await this.repository.save(org);

    // 5. Emit Event
    await OrganizationBusinessEngine.publishEvent(
      "OrganizationCreated", 
      OrganizationMapper.toDTO(org),
      "TraceId-TBD"
    );

    return OrganizationMapper.toDTO(org);
  }

  async updateOrganization(dto: UpdateOrganizationDTO): Promise<OrganizationResponseDTO> {
    const org = await this.repository.findById(dto.id);
    if (!org) {
      throw new OrganizationNotFoundError(dto.id);
    }

    if (dto.name) {
      org.updateName(dto.name);
    }

    if (dto.code && dto.code !== org.code) {
      const existing = await this.repository.findByCode(dto.code);
      if (existing && existing.id !== org.id) {
        throw new InvalidOrganizationCodeError(`Organization with code ${dto.code} already exists`);
      }
      org.updateCode(dto.code);
    }

    if (dto.type) {
      org.updateType(dto.type);
    }

    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        org.activate();
      } else {
        org.deactivate();
      }
    }

    if (dto.parentId !== undefined) {
      if (dto.parentId) {
        const parent = await this.repository.findById(dto.parentId);
        if (!parent) {
          throw new OrganizationNotFoundError(dto.parentId);
        }
        org.setHierarchy(parent);
      } else {
        org.setHierarchy(null);
      }
    }

    org.incrementVersion();
    await this.repository.update(org);

    await OrganizationBusinessEngine.publishEvent(
      "OrganizationUpdated", 
      OrganizationMapper.toDTO(org),
      "TraceId-TBD"
    );

    return OrganizationMapper.toDTO(org);
  }

  async deleteOrganization(id: string): Promise<void> {
    const org = await this.repository.findById(id);
    if (!org) {
      throw new OrganizationNotFoundError(id);
    }
    
    const children = await this.repository.findChildren(id);
    if (children.length > 0) {
       throw new Error("Cannot delete organization with active children");
    }

    org.markAsDeleted();
    org.incrementVersion();
    await this.repository.update(org);

    await OrganizationBusinessEngine.publishEvent(
      "OrganizationDeleted", 
      { id: org.id, code: org.code },
      "TraceId-TBD"
    );
  }

  async getOrganization(id: string): Promise<OrganizationResponseDTO> {
    const org = await this.repository.findById(id);
    if (!org) {
      throw new OrganizationNotFoundError(id);
    }
    return OrganizationMapper.toDTO(org);
  }
}
