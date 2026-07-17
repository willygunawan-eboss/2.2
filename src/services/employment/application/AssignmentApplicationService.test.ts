import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AssignmentApplicationService } from './AssignmentApplicationService.js';
import { Assignment } from '../domain/Assignment.js';
import { db } from '../../../db/index.js';

vi.mock('../../../db/index.js', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          get: vi.fn().mockResolvedValue({ id: 'valid-id', isActive: true, isDeleted: false, type: 'POSITION' })
        }))
      }))
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue({})
      }))
    }))
  }
}));

describe('AssignmentApplicationService', () => {
  let repository: any;
  let eventPublisher: any;
  let timelineService: any;
  let auditService: any;
  let service: AssignmentApplicationService;

  beforeEach(() => {
    repository = {
      findById: vi.fn(),
      findActiveByEmploymentId: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      executeInTransaction: vi.fn(async (cb) => cb(repository))
    };
    eventPublisher = { publish: vi.fn() };
    timelineService = { recordTimeline: vi.fn() };
    auditService = { recordAudit: vi.fn() };

    service = new AssignmentApplicationService(repository, eventPublisher, timelineService, auditService);
  });

  it('should create a new assignment and terminate previous active if exists', async () => {
    const activeAssignment = Assignment.create(
      'prev-id',
      'emp-1',
      'org-1',
      'pos-1',
      null,
      null,
      '2026-01-01',
      null,
      'ACTIVE'
    );
    
    repository.findActiveByEmploymentId.mockResolvedValue(activeAssignment);

    const dto = {
      employmentId: 'emp-1',
      organizationId: 'org-2',
      positionId: 'pos-2',
      effectiveDate: '2026-06-01'
    };

    const result = await service.createAssignment(dto, 'admin');

    expect(activeAssignment.status).toBe('INACTIVE');
    expect(activeAssignment.endDate).toBe('2026-05-31');
    expect(repository.update).toHaveBeenCalledWith(activeAssignment);
    expect(repository.save).toHaveBeenCalled();
    expect(result.organizationId).toBe('org-2');
  });
});
