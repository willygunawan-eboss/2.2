import { PromoteEmployeeDTO } from './dto/PromoteEmployeeDTO';
import { IWorkforceUnitOfWork } from './ports/IWorkforceUnitOfWork';
import { WorkforceDomainService } from '../domain/WorkforceDomainService';
import { WorkforceDomainError, EmployeeNotFoundError } from '../domain/WorkforceErrors';
import { IEventPublisher } from '../../employment/application/ports/IEventPublisher';
import { IAuditService } from '../../employment/application/ports/IAuditService';
import { ITimelineService } from '../../employment/application/ports/ITimelineService';
import { v4 as uuidv4 } from 'uuid';
import { PolicyApplicationService } from '../../policy/application/PolicyApplicationService';
import { WorkflowApplicationService } from '../../workflow/application/WorkflowApplicationService';

export class PromoteEmployeeUseCase {
  constructor(
    private readonly unitOfWork: IWorkforceUnitOfWork,
    private readonly eventPublisher: IEventPublisher,
    private readonly policyService: PolicyApplicationService,
    private readonly workflowService: WorkflowApplicationService,
    private readonly auditService: IAuditService,
    private readonly timelineService: ITimelineService
  ) {}

  async execute(dto: PromoteEmployeeDTO): Promise<{
    employeeId: string,
    oldAssignmentId: string,
    newAssignmentId: string,
    workflowInstanceId: string | null
  }> {
    if (!dto.employeeNumber) throw new WorkforceDomainError("VALIDATION_ERROR", "Employee Number is required");
    if (!dto.newOrganizationId) throw new WorkforceDomainError("VALIDATION_ERROR", "New Organization is required");
    if (!dto.newPositionId) throw new WorkforceDomainError("VALIDATION_ERROR", "New Position is required");
    if (!dto.effectiveDate) throw new WorkforceDomainError("VALIDATION_ERROR", "Effective Date is required");
    if (!dto.reason) throw new WorkforceDomainError("VALIDATION_ERROR", "Promotion Reason is required");

    return await this.unitOfWork.execute(async ({ employeeRepo, employmentRepo, assignmentRepo, orgRepo, posRepo }) => {
      const employee = await employeeRepo.findByEmployeeNumber(dto.employeeNumber);
      if (!employee) throw new EmployeeNotFoundError(dto.employeeNumber);

      const activeEmployment = await employmentRepo.findByEmployeeNumber(dto.employeeNumber);
      if (!activeEmployment) throw new EmployeeNotFoundError(dto.employeeNumber);

      const assignments = await assignmentRepo.findByEmploymentId(activeEmployment.id);
      const activeAssignment = assignments.find(a => a.status === 'ACTIVE');
      
      const org = await orgRepo.findById(dto.newOrganizationId);
      const pos = await posRepo.findById(dto.newPositionId);

      WorkforceDomainService.validatePromotion(employee, activeAssignment || null, org, pos, dto.effectiveDate);

      const policyContext = {
        action: 'PROMOTE_EMPLOYEE',
        employeeId: employee.id,
        currentOrganizationId: activeAssignment!.organizationId,
        newOrganizationId: dto.newOrganizationId,
        reason: dto.reason
      };

      let requireApproval = false;
      try {
        const policyResult = await this.policyService.evaluatePolicyByCode('PROMOTION_APPROVAL', policyContext);
        if (policyResult.effect === 'ALLOW') {
           requireApproval = true; 
        }
      } catch (e) {
        requireApproval = false;
      }
      
      const { updatedOldAssignment, newAssignment } = WorkforceDomainService.processPromotion(
        activeAssignment!,
        dto.newOrganizationId,
        dto.newPositionId,
        dto.effectiveDate
      );

      await assignmentRepo.save(updatedOldAssignment);
      await assignmentRepo.save(newAssignment);

      // No longer denormalize positionId or jobGradeId to employee
      // if (dto.newJobGradeId) { employee.jobGradeId = dto.newJobGradeId; await employeeRepo.update(employee.id, employee); }

      await this.auditService.recordAudit(activeEmployment.id, "TERMINATE_ASSIGNMENT", dto.actor, { assignmentId: updatedOldAssignment.id, reason: dto.reason });
      await this.auditService.recordAudit(activeEmployment.id, "CREATE_ASSIGNMENT", dto.actor, { assignmentId: newAssignment.id, reason: dto.reason, type: "PROMOTION" });
      
      await this.timelineService.recordTimeline(activeEmployment.id, "PROMOTED", dto.actor, {
        reason: dto.reason,
        effectiveDate: dto.effectiveDate,
        newPositionId: dto.newPositionId
      });

      let workflowInstanceId = null;
      if (requireApproval) {
          const wf = await this.workflowService.startWorkflowByCode(
             'promote_wf',
             'PROMOTION',
             newAssignment.id,
             { reason: dto.reason, effectiveDate: dto.effectiveDate },
             dto.actor
          );
          workflowInstanceId = wf.id;
      }

      const traceId = uuidv4();
      const payload = {
        employeeId: employee.id,
        employmentId: activeEmployment.id,
        oldAssignmentId: updatedOldAssignment.id,
        newAssignmentId: newAssignment.id,
        oldOrganizationId: updatedOldAssignment.organizationId,
        newOrganizationId: dto.newOrganizationId,
        oldPositionId: updatedOldAssignment.positionId,
        newPositionId: dto.newPositionId,
        newJobGradeId: dto.newJobGradeId,
        reason: dto.reason,
        effectiveDate: dto.effectiveDate,
        workflowInstanceId,
        traceId,
        correlationId: uuidv4()
      };
      
      await this.eventPublisher.publish("EmployeePromoted", payload, traceId);

      return {
        employeeId: employee.id,
        oldAssignmentId: updatedOldAssignment.id,
        newAssignmentId: newAssignment.id,
        workflowInstanceId
      };
    });
  }
}
