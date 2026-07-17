import { v4 as uuidv4 } from 'uuid';
import { JobFamilyRepository } from '../repository/JobFamilyRepository.js';
import { JobGradeRepository } from '../repository/JobGradeRepository.js';
import { JobRepository } from '../repository/JobRepository.js';
import { JobFamily } from '../domain/JobFamily.js';
import { JobGrade } from '../domain/JobGrade.js';
import { Job } from '../domain/Job.js';
import { 
  CreateJobFamilyDTO, UpdateJobFamilyDTO, JobFamilyDTO,
  CreateJobGradeDTO, UpdateJobGradeDTO, JobGradeDTO,
  CreateJobDTO, UpdateJobDTO, JobDTO
} from './dto/JobArchitectureDTO.js';
import { JobArchitectureMapper } from './dto/JobArchitectureMapper.js';

export class JobArchitectureApplicationService {
  constructor(
    private readonly jobFamilyRepo: JobFamilyRepository,
    private readonly jobGradeRepo: JobGradeRepository,
    private readonly jobRepo: JobRepository
  ) {}

  // ============================
  // JOB FAMILY
  // ============================
  async createJobFamily(dto: CreateJobFamilyDTO): Promise<JobFamilyDTO> {
    const existing = await this.jobFamilyRepo.findByCode(dto.code);
    if (existing) {
      throw new Error(`JobFamily with code ${dto.code} already exists.`);
    }

    const jobFamily = JobFamily.create(
      uuidv4(),
      dto.code,
      dto.name,
      dto.description || null
    );

    await this.jobFamilyRepo.save(jobFamily);
    return JobArchitectureMapper.toJobFamilyDTO(jobFamily);
  }

  async updateJobFamily(id: string, dto: UpdateJobFamilyDTO): Promise<JobFamilyDTO> {
    const jobFamily = await this.jobFamilyRepo.findById(id);
    if (!jobFamily) throw new Error('JobFamily not found');

    jobFamily.update(
      dto.name !== undefined ? dto.name : jobFamily.name,
      dto.description !== undefined ? dto.description : jobFamily.description,
      dto.isActive !== undefined ? dto.isActive : jobFamily.isActive
    );

    await this.jobFamilyRepo.update(jobFamily);
    return JobArchitectureMapper.toJobFamilyDTO(jobFamily);
  }

  async deleteJobFamily(id: string): Promise<void> {
    const jobFamily = await this.jobFamilyRepo.findById(id);
    if (!jobFamily) throw new Error('JobFamily not found');

    const isUsed = await this.jobFamilyRepo.isUsedByJob(id);
    if (isUsed) throw new Error('JobFamily cannot be deleted because it is used by one or more Jobs.');

    jobFamily.delete();
    await this.jobFamilyRepo.delete(jobFamily);
  }

  async getJobFamily(id: string): Promise<JobFamilyDTO> {
    const jobFamily = await this.jobFamilyRepo.findById(id);
    if (!jobFamily) throw new Error('JobFamily not found');
    return JobArchitectureMapper.toJobFamilyDTO(jobFamily);
  }

  async getAllJobFamilies(): Promise<JobFamilyDTO[]> {
    const families = await this.jobFamilyRepo.findAll();
    return families.map(JobArchitectureMapper.toJobFamilyDTO);
  }

  // ============================
  // JOB GRADE
  // ============================
  async createJobGrade(dto: CreateJobGradeDTO): Promise<JobGradeDTO> {
    const existing = await this.jobGradeRepo.findByCode(dto.code);
    if (existing) {
      throw new Error(`JobGrade with code ${dto.code} already exists.`);
    }

    const jobGrade = JobGrade.create(
      uuidv4(),
      dto.code,
      dto.name,
      dto.level,
      dto.description || null
    );

    await this.jobGradeRepo.save(jobGrade);
    return JobArchitectureMapper.toJobGradeDTO(jobGrade);
  }

  async updateJobGrade(id: string, dto: UpdateJobGradeDTO): Promise<JobGradeDTO> {
    const jobGrade = await this.jobGradeRepo.findById(id);
    if (!jobGrade) throw new Error('JobGrade not found');

    jobGrade.update(
      dto.name !== undefined ? dto.name : jobGrade.name,
      dto.level !== undefined ? dto.level : jobGrade.level,
      dto.description !== undefined ? dto.description : jobGrade.description,
      dto.isActive !== undefined ? dto.isActive : jobGrade.isActive
    );

    await this.jobGradeRepo.update(jobGrade);
    return JobArchitectureMapper.toJobGradeDTO(jobGrade);
  }

  async deleteJobGrade(id: string): Promise<void> {
    const jobGrade = await this.jobGradeRepo.findById(id);
    if (!jobGrade) throw new Error('JobGrade not found');

    const isUsed = await this.jobGradeRepo.isUsedByJob(id);
    if (isUsed) throw new Error('JobGrade cannot be deleted because it is used by one or more Jobs.');

    jobGrade.delete();
    await this.jobGradeRepo.delete(jobGrade);
  }

  async getJobGrade(id: string): Promise<JobGradeDTO> {
    const jobGrade = await this.jobGradeRepo.findById(id);
    if (!jobGrade) throw new Error('JobGrade not found');
    return JobArchitectureMapper.toJobGradeDTO(jobGrade);
  }

  async getAllJobGrades(): Promise<JobGradeDTO[]> {
    const grades = await this.jobGradeRepo.findAll();
    return grades.map(JobArchitectureMapper.toJobGradeDTO);
  }

  // ============================
  // JOB
  // ============================
  async createJob(dto: CreateJobDTO): Promise<JobDTO> {
    const existing = await this.jobRepo.findByCode(dto.code);
    if (existing) {
      throw new Error(`Job with code ${dto.code} already exists.`);
    }

    const jobFamily = await this.jobFamilyRepo.findById(dto.jobFamilyId);
    if (!jobFamily) throw new Error('JobFamily not found');

    const jobGrade = await this.jobGradeRepo.findById(dto.jobGradeId);
    if (!jobGrade) throw new Error('JobGrade not found');

    const job = Job.create(
      uuidv4(),
      dto.code,
      dto.name,
      dto.jobFamilyId,
      dto.jobGradeId,
      dto.description || null
    );

    await this.jobRepo.save(job);
    return JobArchitectureMapper.toJobDTO(job);
  }

  async updateJob(id: string, dto: UpdateJobDTO): Promise<JobDTO> {
    const job = await this.jobRepo.findById(id);
    if (!job) throw new Error('Job not found');

    if (dto.jobFamilyId && dto.jobFamilyId !== job.jobFamilyId) {
      const jobFamily = await this.jobFamilyRepo.findById(dto.jobFamilyId);
      if (!jobFamily) throw new Error('JobFamily not found');
    }

    if (dto.jobGradeId && dto.jobGradeId !== job.jobGradeId) {
      const jobGrade = await this.jobGradeRepo.findById(dto.jobGradeId);
      if (!jobGrade) throw new Error('JobGrade not found');
    }

    job.update(
      dto.name !== undefined ? dto.name : job.name,
      dto.jobFamilyId !== undefined ? dto.jobFamilyId : job.jobFamilyId,
      dto.jobGradeId !== undefined ? dto.jobGradeId : job.jobGradeId,
      dto.description !== undefined ? dto.description : job.description,
      dto.isActive !== undefined ? dto.isActive : job.isActive
    );

    await this.jobRepo.update(job);
    return JobArchitectureMapper.toJobDTO(job);
  }

  async deleteJob(id: string): Promise<void> {
    const job = await this.jobRepo.findById(id);
    if (!job) throw new Error('Job not found');

    const isUsed = await this.jobRepo.isUsedByPosition(id);
    if (isUsed) throw new Error('Job cannot be deleted because it is used by one or more active Positions.');

    job.delete();
    await this.jobRepo.delete(job);
  }

  async getJob(id: string): Promise<JobDTO> {
    const job = await this.jobRepo.findById(id);
    if (!job) throw new Error('Job not found');
    return JobArchitectureMapper.toJobDTO(job);
  }

  async getAllJobs(): Promise<JobDTO[]> {
    const jobs = await this.jobRepo.findAll();
    return jobs.map(JobArchitectureMapper.toJobDTO);
  }
}
