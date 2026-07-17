import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HireEmployeeUseCase } from './HireEmployeeUseCase';
import { HireEmployeeDTO } from './dto/HireEmployeeDTO';

describe('HireEmployeeUseCase', () => {
  let eventPublisher: any;
  let unitOfWork: any;
  let useCase: HireEmployeeUseCase;

  const mockEmployeeRepo = {
    findByEmployeeNumber: vi.fn().mockResolvedValue(null),
    create: vi.fn().mockResolvedValue({ id: 'emp-1' })
  };
  const mockEmploymentRepo = {
    save: vi.fn().mockResolvedValue(undefined)
  };
  const mockAssignmentRepo = {
    save: vi.fn().mockResolvedValue(undefined)
  };
  const mockOrgRepo = {
    findById: vi.fn().mockResolvedValue({ id: 'org-1', isActive: true, isDeleted: false })
  };
  const mockPosRepo = {
    findById: vi.fn().mockResolvedValue({ id: 'pos-1', isActive: true, isDeleted: false })
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    eventPublisher = {
      publish: vi.fn()
    };
    
    unitOfWork = {
      execute: vi.fn(async (operation) => {
        return await operation({
          employeeRepo: mockEmployeeRepo,
          employmentRepo: mockEmploymentRepo,
          assignmentRepo: mockAssignmentRepo,
          orgRepo: mockOrgRepo,
          posRepo: mockPosRepo
        });
      })
    };
    
    useCase = new HireEmployeeUseCase(unitOfWork, eventPublisher, { recordAudit: vi.fn() } as any, { recordTimeline: vi.fn() } as any);
  });

  const validDTO: HireEmployeeDTO = {
    employeeNumber: 'EMP-123',
    name: 'John Doe',
    companyId: 'C1',
    branchId: 'B1',
    divisionId: 'D1',
    departmentId: 'DEPT1',
    jobGradeId: 'JG1',
    employmentType: 'PERMANENT',
    employmentStatus: 'ACTIVE',
    organizationId: 'org-1',
    positionId: 'pos-1',
    effectiveDate: '2026-07-16',
    actor: 'admin'
  };

  it('should successfully hire an employee and publish event', async () => {
    const result = await useCase.execute(validDTO);
    
    expect(result).toBeDefined();
    expect(result.employee.id).toBe('emp-1');
    expect(result.employmentId).toBeDefined();
    expect(result.assignmentId).toBeDefined();
    
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      "EmployeeHired",
      expect.objectContaining({
        employeeId: expect.any(String),
        employmentId: expect.any(String),
        assignmentId: expect.any(String),
        organizationId: 'org-1',
        positionId: 'pos-1'
      }),
      expect.any(String)
    );
  });

  it('should throw error if validation fails', async () => {
    const invalidDTO = { ...validDTO, employeeNumber: '' };
    await expect(useCase.execute(invalidDTO)).rejects.toThrow("Employee Number is required");
    expect(unitOfWork.execute).not.toHaveBeenCalled();
  });
});
