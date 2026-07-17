import { TerminateEmployeeDTO } from './dto/TerminateEmployeeDTO';
import { IWorkforceUnitOfWork } from './ports/IWorkforceUnitOfWork';
import { WorkforceDomainService } from '../domain/WorkforceDomainService';
import { WorkforceDomainError, EmployeeNotFoundError } from '../domain/WorkforceErrors';
import { IEventPublisher } from '../../employment/application/ports/IEventPublisher';
import { IAuditService } from '../../employment/application/ports/IAuditService';
import { ITimelineService } from '../../employment/application/ports/ITimelineService';
import { v4 as uuidv4 } from 'uuid';
import { PolicyApplicationService } from '../../policy/application/PolicyApplicationService';
import { WorkflowApplicationService } from '../../workflow/application/WorkflowApplicationService';

export class TerminateEmployeeUseCase {
  constructor(
    private readonly unitOfWork: IWorkforceUnitOfWork,
    private readonly eventPublisher: IEventPublisher,
    private readonly policyService: PolicyApplicationService,
    private readonly workflowService: WorkflowApplicationService,
    private readonly auditService: IAuditService,
    private readonly timelineService: ITimelineService
  ) {}

  async execute(dto: TerminateEmployeeDTO): Promise<any> {
    if (!dto.employeeNumber) throw new WorkforceDomainError("VALIDATION_ERROR", "Employee Number is required");
    if (!dto.effectiveDate) throw new WorkforceDomainError("VALIDATION_ERROR", "Effective Date is required");
    if (!dto.reason) throw new WorkforceDomainError("VALIDATION_ERROR", "Reason is required");

    return await this.unitOfWork.execute(async ({ employeeRepo, employmentRepo, assignmentRepo }) => {
      const employee = await employeeRepo.findByEmployeeNumber(dto.employeeNumber);
      if (!employee) throw new EmployeeNotFoundError(dto.employeeNumber);

      const activeEmployment = await employmentRepo.findByEmployeeNumber(dto.employeeNumber);
      if (!activeEmployment) throw new EmployeeNotFoundError(dto.employeeNumber);

      const assignments = await assignmentRepo.findByEmploymentId(activeEmployment.id);
      const activeAssignment = assignments.find(a => a.status === 'ACTIVE');

      WorkforceDomainService.validateTermination(employee, activeAssignment || null, dto.effectiveDate);

      const policyContext = {
        action: 'TERMINATE_EMPLOYEE',
        employeeId: employee.id,
        reason: dto.reason
      };

      let requireApproval = false;
      try {
        const policyResult = await this.policyService.evaluatePolicyByCode('TERMINATION_APPROVAL', policyContext);
        if (policyResult.effect === 'ALLOW') {
          requireApproval = true;
        }
      } catch (e) {
        requireApproval = false;
      }

      const { updatedOldAssignment, updatedEmployment } = WorkforceDomainService.processTermination(
        activeAssignment!,
        activeEmployment,
        dto.effectiveDate
      );

      await assignmentRepo.save(updatedOldAssignment);
      await employmentRepo.save(updatedEmployment);

      // We do not change positionId in employee table anymore since it is dropped.
      // But we should update employee status to Inactive.
      employee.status = 'Inactive';
      await employeeRepo.update(employee.id, employee);

      await this.auditService.recordAudit(activeEmployment.id, "TERMINATE_ASSIGNMENT", dto.actor, { assignmentId: updatedOldAssignment.id, reason: dto.reason });
      await this.auditService.recordAudit(activeEmployment.id, "TERMINATE_EMPLOYMENT", dto.actor, { reason: dto.reason, terminationType: dto.terminationType });
      await this.timelineService.recordTimeline(activeEmployment.id, "TERMINATED", dto.actor, { reason: dto.reason, effectiveDate: dto.effectiveDate });

      let workflowInstanceId = null;
      if (requireApproval) {
          const wf = await this.workflowService.startWorkflowByCode(
             'terminate_wf',
             'TERMINATION',
             updatedEmployment.id,
             { reason: dto.reason, effectiveDate: dto.effectiveDate },
             dto.actor
          );
          workflowInstanceId = wf.id;
      }

      const traceId = uuidv4();
      const payload = {
        employeeId: employee.id,
        employmentId: activeEmployment.id,
        assignmentId: updatedOldAssignment.id,
        reason: dto.reason,
        terminationType: dto.terminationType,
        effectiveDate: dto.effectiveDate,
        workflowInstanceId,
        traceId,
        correlationId: uuidv4()
      };
      
      await this.eventPublisher.publish("EmployeeTerminated", payload, traceId);

      return {
        employeeId: employee.id,
        employmentId: activeEmployment.id,
        workflowInstanceId
      };
    });
  }
}
