import { IOrganizationRepository } from "../repository/IOrganizationRepository.js";
import { OrganizationResponseDTO } from "../dto/OrganizationDTO.js";
import { OrganizationMapper } from "../dto/OrganizationMapper.js";
import { OrganizationNotFoundError, InvalidOrganizationParentError, CircularDependencyError } from "../domain/OrganizationErrors.js";
import { IEventPublisher } from "./ports/IEventPublisher.js";
import { ITimelineService } from "./ports/ITimelineService.js";
import { IAuditService } from "./ports/IAuditService.js";
import { v4 as uuidv4 } from "uuid";
import { Organization } from "../domain/Organization.js";

export class MoveOrganizationUseCase {
  constructor(
    private readonly repository: IOrganizationRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly timelineService: ITimelineService,
    private readonly auditService: IAuditService
  ) {}

  async execute(id: string, newParentId: string, actor: string): Promise<OrganizationResponseDTO> {
    if (!newParentId) {
      throw new InvalidOrganizationParentError("New parent ID is required. Cannot move to root.");
    }

    if (id === newParentId) {
      throw new InvalidOrganizationParentError("Cannot move an organization to itself");
    }

    return this.repository.executeInTransaction(async (txRepo) => {
      const org = await txRepo.findById(id);
      if (!org) {
        throw new OrganizationNotFoundError(id);
      }
      if (org.isDeleted || !org.isActive) {
        throw new Error("Cannot move an inactive or deleted organization");
      }
      if (!org.parentId) {
         throw new InvalidOrganizationParentError("Cannot move root organization");
      }

      const newParent = await txRepo.findById(newParentId);
      if (!newParent) {
        throw new OrganizationNotFoundError(newParentId);
      }
      if (newParent.isDeleted || !newParent.isActive) {
        throw new InvalidOrganizationParentError("Cannot move to an inactive or deleted parent");
      }

      const descendants = await txRepo.findDescendants(id);
      if (descendants.some(d => d.id === newParentId)) {
        throw new CircularDependencyError(id, newParentId);
      }

      const oldParentId = org.parentId;
      const oldPath = org.path;

      // Move the organization
      org.setHierarchy(newParent);
      org.incrementVersion();
      await txRepo.update(org);

      // We need to update all descendants because their level and path changed.
      // Wait, if we use a recursive function in memory to update descendants, we can do it!
      
      const nodesToUpdate = new Map<string, Organization>();
      nodesToUpdate.set(org.id, org);

      // Order descendants by level so parents are updated before their children
      descendants.sort((a, b) => a.level - b.level);
      
      for (const desc of descendants) {
        const parentOfDesc = nodesToUpdate.get(desc.parentId!) || await txRepo.findById(desc.parentId!);
        if (parentOfDesc) {
           desc.setHierarchy(parentOfDesc);
           desc.incrementVersion();
           await txRepo.update(desc);
           nodesToUpdate.set(desc.id, desc);
        }
      }

      const newPath = org.path;

      const resultDto = OrganizationMapper.toDTO(org);
      const traceId = uuidv4();
      const correlationId = uuidv4();

      await this.timelineService.recordTimeline(org.id, "ORGANIZATION_MOVED", actor, {
        oldParentId,
        newParentId: org.parentId
      });

      await this.auditService.recordAudit(org.id, "MOVE_ORGANIZATION", actor, {
        oldParentId,
        newParentId: org.parentId
      });

      await this.eventPublisher.publish("OrganizationMoved", {
        organizationId: org.id,
        oldParentId,
        newParentId: org.parentId,
        oldPath,
        newPath,
        timestamp: new Date().toISOString(),
        traceId,
        correlationId
      }, traceId);

      return resultDto;
    });
  }
}
