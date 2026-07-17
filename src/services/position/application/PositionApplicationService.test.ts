import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PositionApplicationService } from './PositionApplicationService.js';
import { Position } from '../domain/Position.js';
import { db } from '../../../db/index.js';

vi.mock('../../../db/index.js', () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          get: vi.fn().mockResolvedValue({ id: 'comp-1', isActive: true, isDeleted: false, type: 'COMPANY' })
        }))
      }))
    }))
  }
}));

describe('PositionApplicationService', () => {
  let repository: any;
  let eventPublisher: any;
  let timelineService: any;
  let auditService: any;
  let service: PositionApplicationService;

  beforeEach(() => {
    repository = {
      findById: vi.fn(),
      findByCode: vi.fn(),
      findByNameAndCompany: vi.fn(),
      isPositionInUse: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      executeInTransaction: vi.fn(async (cb) => cb(repository))
    };
    eventPublisher = { publish: vi.fn() };
    timelineService = { recordTimeline: vi.fn() };
    auditService = { recordAudit: vi.fn() };

    service = new PositionApplicationService(repository, eventPublisher, timelineService, auditService);
  });

  it('should create a new position successfully', async () => {
    repository.findByCode.mockResolvedValue(null);
    repository.findByNameAndCompany.mockResolvedValue(null);

    const dto = {
      code: 'POS-001',
      name: 'Software Engineer',
      companyId: 'comp-1',
      effectiveDate: '2026-07-01'
    };

    const result = await service.createPosition(dto, 'admin');

    expect(result.code).toBe('POS-001');
    expect(result.name).toBe('Software Engineer');
    expect(repository.save).toHaveBeenCalled();
  });

  it('should throw DuplicatePositionCodeError if code exists', async () => {
    repository.findByCode.mockResolvedValue({ isDeleted: false });

    const dto = {
      code: 'POS-001',
      name: 'Software Engineer',
      effectiveDate: '2026-07-01'
    };

    await expect(service.createPosition(dto, 'admin')).rejects.toThrow(/already exists/);
  });

  it('should prevent deletion of position in use', async () => {
    const position = Position.create('pos-1', 'POS-001', 'Software Engineer', null, null, null, 'ACTIVE', '2026-07-01');
    repository.findById.mockResolvedValue(position);
    repository.isPositionInUse.mockResolvedValue(true);

    await expect(service.deletePosition('pos-1', 'admin')).rejects.toThrow(/cannot be deleted because it is assigned/);
  });
});
