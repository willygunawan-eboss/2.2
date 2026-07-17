import { eq, and } from 'drizzle-orm';
import { db } from '../../../db/index.js';
import { jobFamily, jobPlatform } from '../../../db/schema.js';
import { JobFamily } from '../domain/JobFamily.js';
import { JobFamilyRepository } from './JobFamilyRepository.js';

export class JobFamilyRepositoryImpl implements JobFamilyRepository {
  constructor(private readonly transaction?: any) {}

  private get dbContext() {
    return this.transaction || db;
  }

  private mapToDomain(record: any): JobFamily {
    return JobFamily.create(
      record.id,
      record.code,
      record.name,
      record.description,
      record.isActive,
      record.isDeleted
    );
  }

  async findById(id: string): Promise<JobFamily | null> {
    const record = await this.dbContext
      .select()
      .from(jobFamily)
      .where(and(eq(jobFamily.id, id), eq(jobFamily.isDeleted, false)))
      .get();
    
    return record ? this.mapToDomain(record) : null;
  }

  async findByCode(code: string): Promise<JobFamily | null> {
    const record = await this.dbContext
      .select()
      .from(jobFamily)
      .where(and(eq(jobFamily.code, code), eq(jobFamily.isDeleted, false)))
      .get();
    
    return record ? this.mapToDomain(record) : null;
  }

  async findAll(): Promise<JobFamily[]> {
    const records = await this.dbContext
      .select()
      .from(jobFamily)
      .where(eq(jobFamily.isDeleted, false))
      .all();
    
    return records.map((record: any) => this.mapToDomain(record));
  }

  async save(jobFamilyObj: JobFamily): Promise<void> {
    await this.dbContext.insert(jobFamily).values({
      id: jobFamilyObj.id,
      code: jobFamilyObj.code,
      name: jobFamilyObj.name,
      description: jobFamilyObj.description,
      isActive: jobFamilyObj.isActive,
      isDeleted: jobFamilyObj.isDeleted
    });
  }

  async update(jobFamilyObj: JobFamily): Promise<void> {
    await this.dbContext
      .update(jobFamily)
      .set({
        name: jobFamilyObj.name,
        description: jobFamilyObj.description,
        isActive: jobFamilyObj.isActive,
        isDeleted: jobFamilyObj.isDeleted,
        updatedAt: new Date().toISOString()
      })
      .where(eq(jobFamily.id, jobFamilyObj.id));
  }

  async delete(jobFamilyObj: JobFamily): Promise<void> {
    await this.update(jobFamilyObj);
  }

  async isUsedByJob(jobFamilyId: string): Promise<boolean> {
    const record = await this.dbContext
      .select({ id: jobPlatform.id })
      .from(jobPlatform)
      .where(and(eq(jobPlatform.jobFamilyId, jobFamilyId), eq(jobPlatform.isDeleted, false)))
      .limit(1)
      .get();
    
    return !!record;
  }

  async executeInTransaction<T>(operation: (repo: JobFamilyRepository) => Promise<T>): Promise<T> {
    if (this.transaction) {
      return operation(this);
    }
    return db.transaction(async (tx: any) => {
      const transactionalRepo = new JobFamilyRepositoryImpl(tx);
      return operation(transactionalRepo);
    });
  }
}
