import { IAssignmentRepository } from "../repository/IAssignmentRepository.js";
import { Assignment } from "../domain/Assignment.js";
import { CreateAssignmentDTO, AssignmentResponseDTO, TerminateAssignmentDTO } from "./dto/AssignmentDTO.js";
import { AssignmentMapper } from "./dto/AssignmentMapper.js";
import { AssignmentValidator } from "./validation/AssignmentValidator.js";
import { AssignmentNotFoundError, DuplicateActiveAssignmentError, InvalidAssignmentDateError } from "../domain/AssignmentErrors.js";
import { IEventPublisher } from "./ports/IEventPublisher.js";
import { ITimelineService } from "./ports/ITimelineService.js";
import { IAuditService } from "./ports/IAuditService.js";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { eq } from "drizzle-orm";

export class AssignmentApplicationService {
  constructor(
    private readonly repository: IAssignmentRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly timelineService: ITimelineService,
    private readonly auditService: IAuditService
  ) {}

  private async validateReferences(dto: CreateAssignmentDTO) {
    // Validate Employment
    const emp = await db.select().from(schema.empPlatform).where(eq(schema.empPlatform.id, dto.employmentId)).get();
    if (!emp) throw new Error("Employment reference is invalid");

    // Validate Organization
    const org = await db.select().from(schema.orgPlatform).where(eq(schema.orgPlatform.id, dto.organizationId)).get();
    if (!org || !org.isActive || org.isDeleted) throw new Error("Organization reference is invalid or inactive");

    // Validate Position
    const pos = await db.select().from(schema.orgPlatform).where(eq(schema.orgPlatform.id, dto.positionId)).get();
    if (!pos || !pos.isActive || pos.isDeleted) throw new Error("Position reference is invalid or inactive");
    if (pos.type !== "POSITION") throw new Error("Position reference must be of type POSITION");

    // Validate Manager
    if (dto.managerId) {
      const mgr = await db.select().from(schema.empPlatform).where(eq(schema.empPlatform.id, dto.managerId)).get();
      if (!mgr || !mgr.isActive || mgr.isDeleted) throw new Error("Manager reference is invalid or inactive");
    }

    // Validate Supervisor
    if (dto.supervisorId) {
      const sup = await db.select().from(schema.empPlatform).where(eq(schema.empPlatform.id, dto.supervisorId)).get();
      if (!sup || !sup.isActive || sup.isDeleted) throw new Error("Supervisor reference is invalid or inactive");
    }
  }

  async createAssignment(dto: CreateAssignmentDTO, actor: string): Promise<AssignmentResponseDTO> {
    AssignmentValidator.validateCreate(dto);
    await this.validateReferences(dto);

    return this.repository.executeInTransaction(async (repo) => {
      // Check if there is an active assignment
      const activeAssignment = await repo.findActiveByEmploymentId(dto.employmentId);
      
      if (activeAssignment) {
        // We terminate the previous assignment right before the new one starts
        // Or if the user explicitely wants a Transfer/Promotion, they should use those methods.
        // But for generic creation, we can auto-terminate the previous one.
        const prevEndDate = new Date(new Date(dto.effectiveDate).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        if (new Date(activeAssignment.effectiveDate) >= new Date(dto.effectiveDate)) {
           throw new InvalidAssignmentDateError("New assignment effective date must be after the current active assignment effective date");
        }
        
        activeAssignment.terminate(prevEndDate);
        activeAssignment.incrementVersion();
        await repo.update(activeAssignment);
      }

      const assignment = Assignment.create(
        null,
        dto.employmentId,
        dto.organizationId,
        dto.positionId,
        dto.managerId || null,
        dto.supervisorId || null,
        dto.effectiveDate
      );

      await repo.save(assignment);

      // Update the organization reference in empPlatform for backward compatibility / easy query
      await db.update(schema.empPlatform)
        .set({ organizationId: dto.organizationId })
        .where(eq(schema.empPlatform.id, dto.employmentId));

      const resultDto = AssignmentMapper.toDTO(assignment);
      const traceId = uuidv4();

      await this.timelineService.recordTimeline(assignment.id, "ASSIGNMENT_CREATED", actor, resultDto);
      await this.auditService.recordAudit(assignment.id, "CREATE_ASSIGNMENT", actor, resultDto);
      await this.eventPublisher.publish("EmploymentAssignmentCreated", resultDto, traceId);

      return resultDto;
    });
  }

  async terminateAssignment(id: string, dto: TerminateAssignmentDTO, actor: string): Promise<void> {
    const assignment = await this.repository.findById(id);
    if (!assignment) {
      throw new AssignmentNotFoundError(id);
    }

    assignment.terminate(dto.endDate);
    assignment.incrementVersion();
    await this.repository.update(assignment);

    const traceId = uuidv4();
    await this.timelineService.recordTimeline(assignment.id, "ASSIGNMENT_TERMINATED", actor, { endDate: dto.endDate });
    await this.auditService.recordAudit(assignment.id, "TERMINATE_ASSIGNMENT", actor, { id: assignment.id, endDate: dto.endDate });
    await this.eventPublisher.publish("EmploymentAssignmentTerminated", { id: assignment.id, endDate: dto.endDate }, traceId);
  }
}
