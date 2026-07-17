import { JobGrade } from '../domain/JobGrade.js';

export interface JobGradeRepository {
  findById(id: string): Promise<JobGrade | null>;
  findByCode(code: string): Promise<JobGrade | null>;
  findAll(): Promise<JobGrade[]>;
  save(jobGrade: JobGrade): Promise<void>;
  update(jobGrade: JobGrade): Promise<void>;
  delete(jobGrade: JobGrade): Promise<void>;
  isUsedByJob(jobGradeId: string): Promise<boolean>;
  executeInTransaction<T>(operation: (repo: JobGradeRepository) => Promise<T>): Promise<T>;
}
