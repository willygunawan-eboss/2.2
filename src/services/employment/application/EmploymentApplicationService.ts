import { IEmploymentRepository } from "../repository/IEmploymentRepository.js";
import { Employment } from "../domain/Employment.js";
import { CreateEmploymentDTO, UpdateEmploymentDTO, EmploymentResponseDTO } from "./dto/EmploymentDTO.js";
import { EmploymentMapper } from "./dto/EmploymentMapper.js";
import { EmploymentValidator } from "./validation/EmploymentValidator.js";
import { EmploymentNotFoundError, InvalidEmployeeNumberError } from "../domain/EmploymentErrors.js";
import { IEventPublisher } from "./ports/IEventPublisher.js";
import { ITimelineService } from "./ports/ITimelineService.js";
import { IAuditService } from "./ports/IAuditService.js";
import { v4 as uuidv4 } from "uuid";

export class EmploymentApplicationService {
  constructor(
    private readonly repository: IEmploymentRepository,
    private readonly eventPublisher: IEventPublisher,
    private readonly timelineService: ITimelineService,
    private readonly auditService: IAuditService
  ) {}

  async createEmployment(dto: CreateEmploymentDTO, actor: string): Promise<EmploymentResponseDTO> {
    EmploymentValidator.validateCreate(dto);
    
    const existing = await this.repository.findByEmployeeNumber(dto.employeeNumber);
    if (existing) {
      throw new InvalidEmployeeNumberError(`Employment with employeeNumber ${dto.employeeNumber} already exists`);
    }

    const emp = Employment.create(
      null, 
      dto.employeeNumber, 
      dto.fullName, 
      dto.organizationId || null,
      dto.employmentType,
      dto.status,
      dto.joinDate
    );

    await this.repository.save(emp);

    const resultDto = EmploymentMapper.toDTO(emp);
    const traceId = uuidv4();

    await this.timelineService.recordTimeline(emp.id, "CREATED", actor, resultDto);
    await this.auditService.recordAudit(emp.id, "CREATE", actor, resultDto);
    await this.eventPublisher.publish("EmploymentCreated", resultDto, traceId);

    return resultDto;
  }

  async updateEmployment(dto: UpdateEmploymentDTO, actor: string): Promise<EmploymentResponseDTO> {
    EmploymentValidator.validateUpdate(dto);

    const emp = await this.repository.findById(dto.id);
    if (!emp) {
      throw new EmploymentNotFoundError(dto.id);
    }

    const oldValue = EmploymentMapper.toDTO(emp);

    if (dto.fullName) emp.updateFullName(dto.fullName);
    if (dto.employeeNumber && dto.employeeNumber !== emp.employeeNumber) {
      const existing = await this.repository.findByEmployeeNumber(dto.employeeNumber);
      if (existing && existing.id !== emp.id) {
        throw new InvalidEmployeeNumberError(`Employment with employeeNumber ${dto.employeeNumber} already exists`);
      }
      emp.updateEmployeeNumber(dto.employeeNumber);
    }
    
    if (dto.employmentType) emp.changeEmploymentType(dto.employmentType);
    if (dto.status) emp.changeStatus(dto.status);
    
    if (dto.organizationId !== undefined) {
      if (dto.organizationId) {
        emp.assignToOrganization(dto.organizationId);
      } else {
        emp.removeFromOrganization();
      }
    }

    if (dto.isActive !== undefined) {
      if (dto.isActive) emp.activate();
      else emp.deactivate();
    }

    emp.incrementVersion();
    await this.repository.update(emp);
    
    const newValue = EmploymentMapper.toDTO(emp);
    const traceId = uuidv4();

    await this.timelineService.recordTimeline(emp.id, "UPDATED", actor, newValue, oldValue);
    await this.auditService.recordAudit(emp.id, "UPDATE", actor, { old: oldValue, new: newValue });
    await this.eventPublisher.publish("EmploymentUpdated", { old: oldValue, new: newValue }, traceId);

    return newValue;
  }

  async terminateEmployment(id: string, terminationDate: string, actor: string): Promise<void> {
    const emp = await this.repository.findById(id);
    if (!emp) {
      throw new EmploymentNotFoundError(id);
    }

    emp.terminate(terminationDate);
    emp.incrementVersion();
    await this.repository.update(emp);

    const traceId = uuidv4();
    await this.timelineService.recordTimeline(emp.id, "TERMINATED", actor, { terminationDate });
    await this.auditService.recordAudit(emp.id, "TERMINATE", actor, { id: emp.id, terminationDate });
    await this.eventPublisher.publish("EmploymentTerminated", { id: emp.id, terminationDate }, traceId);
  }
}
