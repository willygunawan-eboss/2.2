import { eq, and } from 'drizzle-orm';
import { db } from '../../../db/index.js';
import { jobPlatform, posPlatform } from '../../../db/schema.js';
import { Job } from '../domain/Job.js';
import { JobRepository } from './JobRepository.js';

export class JobRepositoryImpl implements JobRepository {
  constructor(private readonly transaction?: any) {}

  private get dbContext() {
    return this.transaction || db;
  }

  private mapToDomain(record: any): Job {
    return Job.create(
      record.id,
      record.code,
      record.name,
      record.jobFamilyId,
      record.jobGradeId,
      record.description,
      record.isActive,
      record.isDeleted
    );
  }

  async findById(id: string): Promise<Job | null> {
    const record = await this.dbContext
      .select()
      .from(jobPlatform)
      .where(and(eq(jobPlatform.id, id), eq(jobPlatform.isDeleted, false)))
      .get();
    
    return record ? this.mapToDomain(record) : null;
  }

  async findByCode(code: string): Promise<Job | null> {
    const record = await this.dbContext
      .select()
      .from(jobPlatform)
      .where(and(eq(jobPlatform.code, code), eq(jobPlatform.isDeleted, false)))
      .get();
    
    return record ? this.mapToDomain(record) : null;
  }

  async findAll(): Promise<Job[]> {
    const records = await this.dbContext
      .select()
      .from(jobPlatform)
      .where(eq(jobPlatform.isDeleted, false))
      .all();
    
    return records.map((record: any) => this.mapToDomain(record));
  }

  async save(job: Job): Promise<void> {
    await this.dbContext.insert(jobPlatform).values({
      id: job.id,
      code: job.code,
      name: job.name,
      jobFamilyId: job.jobFamilyId,
      jobGradeId: job.jobGradeId,
      description: job.description,
      isActive: job.isActive,
      isDeleted: job.isDeleted
    });
  }

  async update(job: Job): Promise<void> {
    await this.dbContext
      .update(jobPlatform)
      .set({
        name: job.name,
        jobFamilyId: job.jobFamilyId,
        jobGradeId: job.jobGradeId,
        description: job.description,
        isActive: job.isActive,
        isDeleted: job.isDeleted,
        updatedAt: new Date().toISOString()
      })
      .where(eq(jobPlatform.id, job.id));
  }

  async delete(job: Job): Promise<void> {
    await this.update(job);
  }

  async isUsedByPosition(jobId: string): Promise<boolean> {
    const record = await this.dbContext
      .select({ id: posPlatform.id })
      .from(posPlatform)
      .where(and(eq(posPlatform.jobId, jobId), eq(posPlatform.isDeleted, false)))
      .limit(1)
      .get();
    
    return !!record;
  }

  async executeInTransaction<T>(operation: (repo: JobRepository) => Promise<T>): Promise<T> {
    if (this.transaction) {
      return operation(this);
    }
    return db.transaction(async (tx: any) => {
      const transactionalRepo = new JobRepositoryImpl(tx);
      return operation(transactionalRepo);
    });
  }
}
