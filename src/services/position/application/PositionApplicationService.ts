import { IPositionRepository } from "../repository/IPositionRepository.js";
import { Position } from "../domain/Position.js";
import { CreatePositionDTO, UpdatePositionDTO, PositionResponseDTO } from "./dto/PositionDTO.js";
import { PositionMapper } from "./dto/PositionMapper.js";
import { PositionValidator } from "./validation/PositionValidator.js";
import { 
  PositionNotFoundError, 
  DuplicatePositionCodeError, 
  DuplicatePositionNameError, 
  InvalidCompanyReferenceError,
  PositionInUseError
} from "../domain/PositionErrors.js";
import { IEventPublisher } from "./ports/IEventPublisher.js";
import { ITimelineService } from "./ports/ITimelineService.js";
import { IAuditService } from "./ports/IAuditService.js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { eq } from "drizzle-orm";

export class PositionApplicationService {
  constructor(
    private readonly repository: IPositionRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly timelineService: ITimelineService,
    private readonly auditService: IAuditService
  ) {}

  private async validateCompanyReference(companyId?: string | null) {
    if (companyId) {
      const company = await db.select().from(schema.orgPlatform).where(eq(schema.orgPlatform.id, companyId)).get();
      if (!company || company.type !== "COMPANY" || !company.isActive || company.isDeleted) {
        throw new InvalidCompanyReferenceError(`Company reference ${companyId} is invalid or not active`);
      }
    }
  }

  async createPosition(dto: CreatePositionDTO, actor: string): Promise<PositionResponseDTO> {
    PositionValidator.validateCreate(dto);
    await this.validateCompanyReference(dto.companyId);

    return this.repository.executeInTransaction(async (repo) => {
      // Check code unique
      const existingCode = await repo.findByCode(dto.code);
      if (existingCode && !existingCode.isDeleted) {
        throw new DuplicatePositionCodeError(`Position with code ${dto.code} already exists`);
      }

      // Check name unique in same company
      if (dto.companyId) {
        const existingName = await repo.findByNameAndCompany(dto.name, dto.companyId);
        if (existingName && !existingName.isDeleted) {
          throw new DuplicatePositionNameError(`Position with name ${dto.name} already exists in company`);
        }
      }

      const position = Position.create(
        null,
        dto.code,
        dto.name,
        dto.companyId || null,
        dto.jobId || null,
        dto.employmentType || null,
        "ACTIVE",
        dto.effectiveDate
      );

      await repo.save(position);

      const resultDto = PositionMapper.toDTO(position);
      const traceId = uuidv4();

      await this.timelineService.recordTimeline(position.id, "POSITION_CREATED", actor, resultDto);
      await this.auditService.recordAudit(position.id, "CREATE_POSITION", actor, resultDto);
      await this.eventPublisher.publish("PositionCreated", resultDto, traceId);

      return resultDto;
    });
  }

  async updatePosition(id: string, dto: UpdatePositionDTO, actor: string): Promise<PositionResponseDTO> {
    PositionValidator.validateUpdate(dto);

    return this.repository.executeInTransaction(async (repo) => {
      const position = await repo.findById(id);
      if (!position || position.isDeleted) {
        throw new PositionNotFoundError(id);
      }

      if (position.companyId && position.name !== dto.name) {
        const existingName = await repo.findByNameAndCompany(dto.name, position.companyId);
        if (existingName && existingName.id !== id && !existingName.isDeleted) {
          throw new DuplicatePositionNameError(`Position with name ${dto.name} already exists in company`);
        }
      }

      position.updateDetails(
        dto.name,
        dto.jobId !== undefined ? dto.jobId : position.jobId,
        dto.employmentType !== undefined ? dto.employmentType : position.employmentType
      );
      position.incrementVersion();

      await repo.update(position);

      const resultDto = PositionMapper.toDTO(position);
      const traceId = uuidv4();

      await this.timelineService.recordTimeline(position.id, "POSITION_UPDATED", actor, resultDto);
      await this.auditService.recordAudit(position.id, "UPDATE_POSITION", actor, resultDto);
      await this.eventPublisher.publish("PositionUpdated", resultDto, traceId);

      return resultDto;
    });
  }

  async changeStatus(id: string, newStatus: string, actor: string): Promise<void> {
    return this.repository.executeInTransaction(async (repo) => {
      const position = await repo.findById(id);
      if (!position || position.isDeleted) {
        throw new PositionNotFoundError(id);
      }

      if (newStatus.toUpperCase() === "INACTIVE") {
        position.deactivate();
      } else if (newStatus.toUpperCase() === "ACTIVE") {
        position.activate();
      } else {
        throw new Error(`Invalid status: ${newStatus}`);
      }

      position.incrementVersion();
      await repo.update(position);

      const traceId = uuidv4();
      await this.timelineService.recordTimeline(position.id, "POSITION_STATUS_CHANGED", actor, { status: newStatus });
      await this.auditService.recordAudit(position.id, "CHANGE_POSITION_STATUS", actor, { status: newStatus });
      await this.eventPublisher.publish("PositionStatusChanged", { id, status: newStatus }, traceId);
    });
  }

  async deletePosition(id: string, actor: string): Promise<void> {
    return this.repository.executeInTransaction(async (repo) => {
      const position = await repo.findById(id);
      if (!position || position.isDeleted) {
        throw new PositionNotFoundError(id);
      }

      const inUse = await repo.isPositionInUse(id);
      if (inUse) {
        throw new PositionInUseError(`Position ${id} cannot be deleted because it is assigned to active employments`);
      }

      position.markAsDeleted();
      position.incrementVersion();
      await repo.delete(id);

      const traceId = uuidv4();
      await this.timelineService.recordTimeline(position.id, "POSITION_DELETED", actor, { id });
      await this.auditService.recordAudit(position.id, "DELETE_POSITION", actor, { id });
      await this.eventPublisher.publish("PositionDeleted", { id }, traceId);
    });
  }
}
