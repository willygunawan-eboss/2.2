import { JobFamily } from '../domain/JobFamily.js';

export interface JobFamilyRepository {
  findById(id: string): Promise<JobFamily | null>;
  findByCode(code: string): Promise<JobFamily | null>;
  findAll(): Promise<JobFamily[]>;
  save(jobFamily: JobFamily): Promise<void>;
  update(jobFamily: JobFamily): Promise<void>;
  delete(jobFamily: JobFamily): Promise<void>;
  isUsedByJob(jobFamilyId: string): Promise<boolean>;
  executeInTransaction<T>(operation: (repo: JobFamilyRepository) => Promise<T>): Promise<T>;
}
