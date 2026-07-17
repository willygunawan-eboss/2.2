import { HireEmployeeDTO } from './dto/HireEmployeeDTO';
import { IWorkforceUnitOfWork } from './ports/IWorkforceUnitOfWork';
import { WorkforceDomainService } from '../domain/WorkforceDomainService';
import { WorkforceDomainError } from '../domain/WorkforceErrors';
import { IEventPublisher } from '../../employment/application/ports/IEventPublisher';
import { IAuditService } from '../../employment/application/ports/IAuditService';
import { ITimelineService } from '../../employment/application/ports/ITimelineService';
import { v4 as uuidv4 } from 'uuid';

export class HireEmployeeUseCase {
  constructor(
    private readonly unitOfWork: IWorkforceUnitOfWork,
    private readonly eventPublisher: IEventPublisher,
    private readonly auditService: IAuditService,
    private readonly timelineService: ITimelineService
  ) {}

  async execute(dto: HireEmployeeDTO): Promise<any> {
    // 1. Validations before Business Rule
    if (!dto.employeeNumber) throw new WorkforceDomainError("VALIDATION_ERROR", "Employee Number is required");
    if (!dto.name) throw new WorkforceDomainError("VALIDATION_ERROR", "Name is required");
    if (!dto.employmentType) throw new WorkforceDomainError("VALIDATION_ERROR", "Employment Type is required");
    if (!dto.organizationId) throw new WorkforceDomainError("VALIDATION_ERROR", "Organization is required");
    if (!dto.positionId) throw new WorkforceDomainError("VALIDATION_ERROR", "Position is required");

    return await this.unitOfWork.execute(async ({ employeeRepo, employmentRepo, assignmentRepo, orgRepo, posRepo }) => {
      // Fetch references
      const existingEmp = await employeeRepo.findByEmployeeNumber(dto.employeeNumber);
      const existingEmployees = existingEmp ? [existingEmp] : [];
      const org = await orgRepo.findById(dto.organizationId);
      const pos = await posRepo.findById(dto.positionId);

      // Business Rules Validations inside Domain Service
      WorkforceDomainService.validateHire(
        existingEmployees,
        org,
        pos,
        dto.employeeNumber,
        dto.organizationId,
        dto.positionId
      );

      // Create Domain Entities
      const { employeeData, employment, assignment } = WorkforceDomainService.createHireEntities(dto);

      // Persist Entities
      const newEmployee = await employeeRepo.create(employeeData);
      await employmentRepo.save(employment);
      await assignmentRepo.save(assignment);

      // Audit and Timeline (can be orchestrated here or handled via Domain Events in event bus)
      await this.auditService.recordAudit(employment.id, 'HIRE_EMPLOYEE', dto.actor, { employeeNumber: dto.employeeNumber });
      await this.timelineService.recordTimeline(employment.id, 'HIRED', dto.actor, { employeeNumber: dto.employeeNumber });

      // Domain Event
      const traceId = uuidv4();
      const payload = {
        employeeId: employeeData.id,
        employmentId: employment.id,
        assignmentId: assignment.id,
        organizationId: dto.organizationId,
        positionId: dto.positionId,
        traceId: traceId,
        correlationId: uuidv4()
      };
      
      await this.eventPublisher.publish("EmployeeHired", payload, traceId);

      return {
        employee: newEmployee,
        employmentId: employment.id,
        assignmentId: assignment.id
      };
    });
  }
}
