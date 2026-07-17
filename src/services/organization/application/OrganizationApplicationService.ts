import { IOrganizationRepository } from "../repository/IOrganizationRepository.js";
import { Organization } from "../domain/Organization.js";
import { CreateOrganizationDTO, UpdateOrganizationDTO, OrganizationResponseDTO } from "../dto/OrganizationDTO.js";
import { OrganizationMapper } from "../dto/OrganizationMapper.js";
import { OrganizationValidator } from "../validation/OrganizationValidator.js";
import { OrganizationNotFoundError, InvalidOrganizationCodeError, InvalidOrganizationParentError, MultipleRootOrganizationError } from "../domain/OrganizationErrors.js";
import { IEventPublisher } from "./ports/IEventPublisher.js";
import { ITimelineService } from "./ports/ITimelineService.js";
import { IAuditService } from "./ports/IAuditService.js";

export class OrganizationApplicationService {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly timelineService: ITimelineService,
    private readonly auditService: IAuditService
  ) {}

  async createOrganization(dto: CreateOrganizationDTO, actor: string): Promise<OrganizationResponseDTO> {
    OrganizationValidator.validateCreate(dto);
    
    const existing = await this.repository.findByCode(dto.code);
    if (existing) {
      throw new InvalidOrganizationCodeError(`Organization with code ${dto.code} already exists`);
    }

    const org = Organization.create(
      null, 
      dto.code, 
      dto.name, 
      dto.type, 
      dto.parentId || null
    );

    if (dto.parentId) {
      const parent = await this.repository.findById(dto.parentId);
      if (!parent) {
        throw new OrganizationNotFoundError(dto.parentId);
      }
      org.setHierarchy(parent);
    } else {
      const existingRoot = await this.repository.findRoot();
      if (existingRoot) {
        throw new MultipleRootOrganizationError();
      }
      org.setHierarchy(null);
    }

    await this.repository.save(org);
    const resultDto = OrganizationMapper.toDTO(org);

    await this.timelineService.recordTimeline(org.id, "CREATED", actor, resultDto);
    await this.auditService.recordAudit(org.id, "CREATE", actor, resultDto);
    await this.eventPublisher.publish("OrganizationCreated", resultDto, "TraceId-TBD");

    return resultDto;
  }

  async updateOrganization(dto: UpdateOrganizationDTO, actor: string): Promise<OrganizationResponseDTO> {
    const org = await this.repository.findById(dto.id);
    if (!org) {
      throw new OrganizationNotFoundError(dto.id);
    }
    const oldValue = OrganizationMapper.toDTO(org);

    if (dto.name) org.updateName(dto.name);
    if (dto.code && dto.code !== org.code) {
      const existing = await this.repository.findByCode(dto.code);
      if (existing && existing.id !== org.id) {
        throw new InvalidOrganizationCodeError(`Organization with code ${dto.code} already exists`);
      }
      org.updateCode(dto.code);
    }
    if (dto.type) org.updateType(dto.type);

    if (dto.isActive !== undefined) {
      if (dto.isActive) org.activate();
      else org.deactivate();
    }

    let action = "UPDATED";
    let eventName = "OrganizationUpdated";

    if (dto.parentId !== undefined && dto.parentId !== org.parentId) {
      if (dto.parentId) {
        const parent = await this.repository.findById(dto.parentId);
        if (!parent) throw new OrganizationNotFoundError(dto.parentId);
        org.setHierarchy(parent);
      } else {
        org.setHierarchy(null);
      }
      action = "MOVED";
      eventName = "OrganizationMoved";
    }

    org.incrementVersion();
    await this.repository.update(org);
    
    const newValue = OrganizationMapper.toDTO(org);
    await this.timelineService.recordTimeline(org.id, action, actor, newValue, oldValue);
    await this.auditService.recordAudit(org.id, action, actor, { old: oldValue, new: newValue });
    await this.eventPublisher.publish(eventName, { old: oldValue, new: newValue }, "TraceId-TBD");

    return newValue;
  }

  async deleteOrganization(id: string, actor: string): Promise<void> {
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

    await this.timelineService.recordTimeline(org.id, "DELETED", actor);
    await this.auditService.recordAudit(org.id, "DELETE", actor, { id: org.id });
    await this.eventPublisher.publish("OrganizationDeleted", { id: org.id, code: org.code }, "TraceId-TBD");
  }
  
  
  async restoreOrganization(id: string, actor: string): Promise<void> {
    const org = await this.repository.findById(id);
    if (!org) {
      throw new OrganizationNotFoundError(id);
    }

    if (org.parentId) {
       const parent = await this.repository.findById(org.parentId);
       if (parent && parent.isDeleted) {
         throw new InvalidOrganizationParentError("Cannot restore organization: Parent is deleted");
       }
    }

    org.restore();
    org.incrementVersion();
    await this.repository.update(org);
    
    await this.timelineService.recordTimeline(org.id, "RESTORED", actor);
    await this.auditService.recordAudit(org.id, "RESTORE", actor, { id: org.id });
    await this.eventPublisher.publish("OrganizationRestored", { id: org.id }, "TraceId-TBD");
  }

  async getOrganization(id: string): Promise<OrganizationResponseDTO> {
    const org = await this.repository.findById(id);
    if (!org) {
      throw new OrganizationNotFoundError(id);
    }
    return OrganizationMapper.toDTO(org);
  }
}
