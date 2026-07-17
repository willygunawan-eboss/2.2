import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TerminateEmployeeUseCase } from './TerminateEmployeeUseCase';
import { TerminateEmployeeDTO } from './dto/TerminateEmployeeDTO';

describe('TerminateEmployeeUseCase', () => {
  let eventPublisher: any;
  let unitOfWork: any;
  let policyService: any;
  let workflowService: any;
  let useCase: TerminateEmployeeUseCase;
  let auditService: any;
  let timelineService: any;

  const mockEmployeeRepo = {
    findByEmployeeNumber: vi.fn().mockResolvedValue({ id: 'emp-1', employeeNumber: 'E001', status: 'Active' }),
    update: vi.fn().mockResolvedValue(undefined)
  };
  const mockEmploymentRepo = {
    findByEmployeeNumber: vi.fn().mockResolvedValue({ id: 'empl-1', employeeNumber: 'E001', terminate: vi.fn() }),
    save: vi.fn().mockResolvedValue(undefined)
  };
  const mockAssignmentRepo = {
    findByEmploymentId: vi.fn().mockResolvedValue([{ id: 'asg-1', status: 'ACTIVE', effectiveDate: '2026-01-01', organizationId: 'org-1', positionId: 'pos-1', terminate: vi.fn() }]),
    save: vi.fn().mockResolvedValue(undefined)
  };

  beforeEach(() => {
    vi.clearAllMocks();
    eventPublisher = { publish: vi.fn() };
    unitOfWork = {
      execute: vi.fn(async (operation) => {
        return await operation({
          employeeRepo: mockEmployeeRepo,
          employmentRepo: mockEmploymentRepo,
          assignmentRepo: mockAssignmentRepo
        });
      })
    };
    policyService = { evaluatePolicyByCode: vi.fn().mockResolvedValue({ isAllowed: true, effect: 'ALLOW' }) };
    workflowService = { startWorkflowByCode: vi.fn().mockResolvedValue({ id: 'wf-1' }) };
    auditService = { recordAudit: vi.fn() };
    timelineService = { recordTimeline: vi.fn() };
    useCase = new TerminateEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);
  });

  const validDTO: TerminateEmployeeDTO = {
    employeeNumber: 'E001',
    effectiveDate: '2026-10-01',
    reason: 'Resignation',
    terminationType: 'RESIGNATION',
    actor: 'admin'
  };

  it('should terminate employee successfully', async () => {
    const result = await useCase.execute(validDTO);
    expect(result).toBeDefined();
    expect(result.workflowInstanceId).toBe('wf-1');
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      "EmployeeTerminated",
      expect.objectContaining({ employeeId: 'emp-1', reason: 'Resignation' }),
      expect.any(String)
    );
  });
});
