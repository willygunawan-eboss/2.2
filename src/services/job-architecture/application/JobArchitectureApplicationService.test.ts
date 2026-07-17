import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JobArchitectureApplicationService } from './JobArchitectureApplicationService.js';
import { JobFamily } from '../domain/JobFamily.js';
import { JobGrade } from '../domain/JobGrade.js';
import { Job } from '../domain/Job.js';

describe('JobArchitectureApplicationService', () => {
  let jobFamilyRepo: any;
  let jobGradeRepo: any;
  let jobRepo: any;
  let service: JobArchitectureApplicationService;

  beforeEach(() => {
    jobFamilyRepo = {
      findById: vi.fn(),
      findByCode: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      isUsedByJob: vi.fn()
    };

    jobGradeRepo = {
      findById: vi.fn(),
      findByCode: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      isUsedByJob: vi.fn()
    };

    jobRepo = {
      findById: vi.fn(),
      findByCode: vi.fn(),
      findAll: vi.fn(),
      save: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      isUsedByPosition: vi.fn()
    };

    service = new JobArchitectureApplicationService(jobFamilyRepo, jobGradeRepo, jobRepo);
  });

  // JOB FAMILY
  it('should create a job family successfully', async () => {
    jobFamilyRepo.findByCode.mockResolvedValue(null);
    const dto = { code: 'JF-01', name: 'Software Engineering', description: null };
    const result = await service.createJobFamily(dto);
    expect(result.code).toBe('JF-01');
    expect(result.name).toBe('Software Engineering');
    expect(jobFamilyRepo.save).toHaveBeenCalled();
  });

  it('should not delete job family if used', async () => {
    const jf = JobFamily.create('id', 'JF-01', 'Name', null);
    jobFamilyRepo.findById.mockResolvedValue(jf);
    jobFamilyRepo.isUsedByJob.mockResolvedValue(true);
    await expect(service.deleteJobFamily('id')).rejects.toThrow(/used by one or more Jobs/);
  });

  // JOB GRADE
  it('should create a job grade successfully', async () => {
    jobGradeRepo.findByCode.mockResolvedValue(null);
    const dto = { code: 'JG-1', name: 'Junior', level: 1, description: null };
    const result = await service.createJobGrade(dto);
    expect(result.code).toBe('JG-1');
    expect(result.level).toBe(1);
    expect(jobGradeRepo.save).toHaveBeenCalled();
  });

  it('should not delete job grade if used', async () => {
    const jg = JobGrade.create('id', 'JG-1', 'Junior', 1, null);
    jobGradeRepo.findById.mockResolvedValue(jg);
    jobGradeRepo.isUsedByJob.mockResolvedValue(true);
    await expect(service.deleteJobGrade('id')).rejects.toThrow(/used by one or more Jobs/);
  });

  // JOB
  it('should create a job successfully', async () => {
    jobRepo.findByCode.mockResolvedValue(null);
    jobFamilyRepo.findById.mockResolvedValue(JobFamily.create('jf-id', 'JF-01', 'SE', null));
    jobGradeRepo.findById.mockResolvedValue(JobGrade.create('jg-id', 'JG-1', 'Junior', 1, null));
    
    const dto = { code: 'J-01', name: 'Junior SE', jobFamilyId: 'jf-id', jobGradeId: 'jg-id' };
    const result = await service.createJob(dto);
    expect(result.code).toBe('J-01');
    expect(jobRepo.save).toHaveBeenCalled();
  });

  it('should not delete job if used by position', async () => {
    const job = Job.create('id', 'J-01', 'SE', 'jf-id', 'jg-id', null);
    jobRepo.findById.mockResolvedValue(job);
    jobRepo.isUsedByPosition.mockResolvedValue(true);
    await expect(service.deleteJob('id')).rejects.toThrow(/used by one or more active Positions/);
  });
});
