import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EmploymentApplicationService } from './EmploymentApplicationService';
import { Employment } from '../domain/Employment';

describe('EmploymentApplicationService', () => {
  let repository: any;
  let eventPublisher: any;
  let timelineService: any;
  let auditService: any;
  let service: EmploymentApplicationService;

  beforeEach(() => {
    repository = {
      findById: vi.fn(),
      findByEmployeeNumber: vi.fn(),
      save: vi.fn(),
      update: vi.fn()
    };
    eventPublisher = { publish: vi.fn() };
    timelineService = { recordTimeline: vi.fn() };
    auditService = { recordAudit: vi.fn() };

    service = new EmploymentApplicationService(repository, eventPublisher, timelineService, auditService);
  });

  it('should create an employment record', async () => {
    repository.findByEmployeeNumber.mockResolvedValue(null);

    const dto = {
      employeeNumber: 'EMP-001',
      fullName: 'John Doe',
      organizationId: 'org-1',
      employmentType: 'PERMANENT',
      status: 'ACTIVE',
      joinDate: '2026-01-01'
    };

    const result = await service.createEmployment(dto, 'admin');

    expect(result.employeeNumber).toBe('EMP-001');
    expect(repository.save).toHaveBeenCalled();
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      'EmploymentCreated',
      expect.anything(),
      expect.any(String)
    );
  });

  it('should terminate an employment record', async () => {
    const emp = Employment.create(
      'emp-1',
      'EMP-001',
      'John Doe',
      'org-1',
      'PERMANENT',
      'ACTIVE',
      '2026-01-01'
    );
    repository.findById.mockResolvedValue(emp);

    await service.terminateEmployment('emp-1', '2026-12-31', 'admin');

    expect(emp.status).toBe('TERMINATED');
    expect(emp.terminationDate).toBe('2026-12-31');
    expect(repository.update).toHaveBeenCalled();
    expect(eventPublisher.publish).toHaveBeenCalledWith(
      'EmploymentTerminated',
      expect.anything(),
      expect.any(String)
    );
  });
});
