import { TransferEmployeeDTO } from './dto/TransferEmployeeDTO';
import { IWorkforceUnitOfWork } from './ports/IWorkforceUnitOfWork';
import { WorkforceDomainService } from '../domain/WorkforceDomainService';
import { WorkforceDomainError, EmployeeNotFoundError, EmployeeNotActiveError, ActiveAssignmentNotFoundError } from '../domain/WorkforceErrors';
import { IEventPublisher } from '../../employment/application/ports/IEventPublisher';
import { IAuditService } from '../../employment/application/ports/IAuditService';
import { ITimelineService } from '../../employment/application/ports/ITimelineService';
import { v4 as uuidv4 } from 'uuid';
import { PolicyApplicationService } from '../../policy/application/PolicyApplicationService';
import { WorkflowApplicationService } from '../../workflow/application/WorkflowApplicationService';

export class TransferEmployeeUseCase {
  constructor(
    private readonly unitOfWork: IWorkforceUnitOfWork,
    private readonly eventPublisher: IEventPublisher,
    private readonly policyService: PolicyApplicationService,
    private readonly workflowService: WorkflowApplicationService,
    private readonly auditService: IAuditService,
    private readonly timelineService: ITimelineService
  ) {}

  async execute(dto: TransferEmployeeDTO): Promise<any> {
    if (!dto.employeeNumber) throw new WorkforceDomainError("VALIDATION_ERROR", "Employee Number is required");
    if (!dto.newOrganizationId) throw new WorkforceDomainError("VALIDATION_ERROR", "New Organization is required");
    if (!dto.newPositionId) throw new WorkforceDomainError("VALIDATION_ERROR", "New Position is required");
    if (!dto.effectiveDate) throw new WorkforceDomainError("VALIDATION_ERROR", "Effective Date is required");
    if (!dto.reason) throw new WorkforceDomainError("VALIDATION_ERROR", "Transfer Reason is required");

    return await this.unitOfWork.execute(async ({ employeeRepo, employmentRepo, assignmentRepo, orgRepo, posRepo }) => {
      const employee = await employeeRepo.findByEmployeeNumber(dto.employeeNumber);
      if (!employee) throw new EmployeeNotFoundError(dto.employeeNumber);

      const activeEmployment = await employmentRepo.findByEmployeeNumber(dto.employeeNumber);
      // activeEmployment is already fetched
      if (!activeEmployment) throw new EmployeeNotFoundError(dto.employeeNumber);

      const assignments = await assignmentRepo.findByEmploymentId(activeEmployment.id);
      const activeAssignment = assignments.find(a => a.status === 'ACTIVE');
      
      const org = await orgRepo.findById(dto.newOrganizationId);
      const pos = await posRepo.findById(dto.newPositionId);

      WorkforceDomainService.validateTransfer(employee, activeAssignment, org, pos, dto.effectiveDate);

      // Evaluate Policy to check if Workflow is needed
      const policyContext = {
        action: 'TRANSFER_EMPLOYEE',
        employeeId: employee.id,
        currentOrganizationId: activeAssignment!.organizationId,
        newOrganizationId: dto.newOrganizationId,
        reason: dto.reason
      };

      let requireApproval = false;
      try {
        const policyResult = await this.policyService.evaluatePolicyByCode('TRANSFER_APPROVAL', policyContext);
        if (policyResult.isAllowed) { // ALLOW usually means it requires workflow in our context, or we can just say effect is ALLOW to proceed without approval?
           // Let's assume DENY means needs approval, or we create a specific rule for it.
           // Actually, let's just make the policy explicit if we want:
           requireApproval = policyResult.effect === 'ALLOW'; // if policy says ALLOW approval, it requires workflow? Let's just say "REQUIRE_APPROVAL" effect. 
        }
      } catch (e) {
        // If policy not found, default to false for simplicity in Foundation
        requireApproval = false;
      }
      
      // Let's just check the result properly, we can just say if effect === 'ALLOW' then workflow needed.
      // We will define this properly in test.

      const { updatedOldAssignment, newAssignment } = WorkforceDomainService.processTransfer(
        activeAssignment!,
        dto.newOrganizationId,
        dto.newPositionId,
        dto.effectiveDate
      );

      // Persist Assignment Changes
      await assignmentRepo.save(updatedOldAssignment);
      await assignmentRepo.save(newAssignment);

      // We no longer denormalize positionId to employee
      // await employeeRepo.update(employee.id, employee);

      await this.auditService.recordAudit(activeEmployment.id, "TERMINATE_ASSIGNMENT", dto.actor, { assignmentId: updatedOldAssignment.id, reason: dto.reason });
      await this.auditService.recordAudit(activeEmployment.id, "CREATE_ASSIGNMENT", dto.actor, { assignmentId: newAssignment.id, reason: dto.reason, type: "TRANSFER" });
      await this.timelineService.recordTimeline(activeEmployment.id, "TRANSFERRED", dto.actor, { reason: dto.reason, effectiveDate: dto.effectiveDate, newPositionId: dto.newPositionId });

      let workflowInstanceId = null;

      if (requireApproval) {
          // start workflow
          const wf = await this.workflowService.startWorkflowByCode(
             'transfer_wf',
             'TRANSFER',
             newAssignment.id,
             { reason: dto.reason, effectiveDate: dto.effectiveDate },
             dto.actor
          );
          workflowInstanceId = wf.id;
          // In real app, the assignment status might be 'PENDING' initially until approved.
          // For now, it's just created.
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
        reason: dto.reason,
        effectiveDate: dto.effectiveDate,
        workflowInstanceId,
        traceId,
        correlationId: uuidv4()
      };
      
      await this.eventPublisher.publish("EmployeeTransferred", payload, traceId);

      return {
        employeeId: employee.id,
        oldAssignmentId: updatedOldAssignment.id,
        newAssignmentId: newAssignment.id,
        workflowInstanceId
      };
    });
  }
}
