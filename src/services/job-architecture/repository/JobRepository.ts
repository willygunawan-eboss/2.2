import { Job } from '../domain/Job.js';

export interface JobRepository {
  findById(id: string): Promise<Job | null>;
  findByCode(code: string): Promise<Job | null>;
  findAll(): Promise<Job[]>;
  save(job: Job): Promise<void>;
  update(job: Job): Promise<void>;
  delete(job: Job): Promise<void>;
  isUsedByPosition(jobId: string): Promise<boolean>;
  executeInTransaction<T>(operation: (repo: JobRepository) => Promise<T>): Promise<T>;
}
