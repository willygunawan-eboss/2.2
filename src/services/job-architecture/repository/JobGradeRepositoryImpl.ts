import { eq, and } from 'drizzle-orm';
import { db } from '../../../db/index.js';
import { jobGrade, jobPlatform } from '../../../db/schema.js';
import { JobGrade } from '../domain/JobGrade.js';
import { JobGradeRepository } from './JobGradeRepository.js';

export class JobGradeRepositoryImpl implements JobGradeRepository {
  constructor(private readonly transaction?: any) {}

  private get dbContext() {
    return this.transaction || db;
  }

  private mapToDomain(record: any): JobGrade {
    return JobGrade.create(
      record.id,
      record.code,
      record.name,
      record.level,
      record.description,
      record.isActive,
      record.isDeleted
    );
  }

  async findById(id: string): Promise<JobGrade | null> {
    const record = await this.dbContext
      .select()
      .from(jobGrade)
      .where(and(eq(jobGrade.id, id), eq(jobGrade.isDeleted, false)))
      .get();
    
    return record ? this.mapToDomain(record) : null;
  }

  async findByCode(code: string): Promise<JobGrade | null> {
    const record = await this.dbContext
      .select()
      .from(jobGrade)
      .where(and(eq(jobGrade.code, code), eq(jobGrade.isDeleted, false)))
      .get();
    
    return record ? this.mapToDomain(record) : null;
  }

  async findAll(): Promise<JobGrade[]> {
    const records = await this.dbContext
      .select()
      .from(jobGrade)
      .where(eq(jobGrade.isDeleted, false))
      .all();
    
    return records.map((record: any) => this.mapToDomain(record));
  }

  async save(jobGradeObj: JobGrade): Promise<void> {
    await this.dbContext.insert(jobGrade).values({
      id: jobGradeObj.id,
      code: jobGradeObj.code,
      name: jobGradeObj.name,
      level: jobGradeObj.level,
      description: jobGradeObj.description,
      isActive: jobGradeObj.isActive,
      isDeleted: jobGradeObj.isDeleted
    });
  }

  async update(jobGradeObj: JobGrade): Promise<void> {
    await this.dbContext
      .update(jobGrade)
      .set({
        name: jobGradeObj.name,
        level: jobGradeObj.level,
        description: jobGradeObj.description,
        isActive: jobGradeObj.isActive,
        isDeleted: jobGradeObj.isDeleted,
        updatedAt: new Date().toISOString()
      })
      .where(eq(jobGrade.id, jobGradeObj.id));
  }

  async delete(jobGradeObj: JobGrade): Promise<void> {
    await this.update(jobGradeObj);
  }

  async isUsedByJob(jobGradeId: string): Promise<boolean> {
    const record = await this.dbContext
      .select({ id: jobPlatform.id })
      .from(jobPlatform)
      .where(and(eq(jobPlatform.jobGradeId, jobGradeId), eq(jobPlatform.isDeleted, false)))
      .limit(1)
      .get();
    
    return !!record;
  }

  async executeInTransaction<T>(operation: (repo: JobGradeRepository) => Promise<T>): Promise<T> {
    if (this.transaction) {
      return operation(this);
    }
    return db.transaction(async (tx: any) => {
      const transactionalRepo = new JobGradeRepositoryImpl(tx);
      return operation(transactionalRepo);
    });
  }
}
