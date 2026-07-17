import { asc, desc, eq, and, like, or } from "drizzle-orm";
import { IPositionRepository } from "./IPositionRepository.js";
import { Position } from "../domain/Position.js";
import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";

export class PositionRepositoryImpl implements IPositionRepository {
  constructor(private readonly tx?: any) {}

  private get dbContext() {
    return this.tx || db;
  }

  async executeInTransaction<T>(operation: (repo: IPositionRepository) => Promise<T>): Promise<T> {
    if (this.tx) {
      return operation(this);
    }
    return this.dbContext.transaction(async (tx: any) => {
      const transactionalRepo = new PositionRepositoryImpl(tx);
      return operation(transactionalRepo);
    });
  }

  async findById(id: string): Promise<Position | null> {
    const record = await this.dbContext.select().from(schema.posPlatform).where(eq(schema.posPlatform.id, id)).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findByCode(code: string): Promise<Position | null> {
    const record = await this.dbContext.select().from(schema.posPlatform).where(eq(schema.posPlatform.code, code)).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findByNameAndCompany(name: string, companyId: string): Promise<Position | null> {
    const record = await this.dbContext.select().from(schema.posPlatform).where(
      and(
        eq(schema.posPlatform.name, name),
        eq(schema.posPlatform.companyId, companyId)
      )
    ).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async save(position: Position): Promise<void> {
    await this.dbContext.insert(schema.posPlatform).values({
      id: position.id,
      code: position.code,
      name: position.name,
      companyId: position.companyId,
      jobId: position.jobId,
      employmentType: position.employmentType,
      status: position.status,
      effectiveDate: position.effectiveDate,
      isActive: position.isActive,
      isDeleted: position.isDeleted,
      version: position.version,
      createdAt: new Date().toISOString()
    });
  }

  async update(position: Position): Promise<void> {
    await this.dbContext.update(schema.posPlatform)
      .set({
        name: position.name,
        companyId: position.companyId,
        jobId: position.jobId,
        employmentType: position.employmentType,
        status: position.status,
        isActive: position.isActive,
        isDeleted: position.isDeleted,
        version: position.version,
        updatedAt: new Date().toISOString()
      })
      .where(eq(schema.posPlatform.id, position.id));
  }

  async delete(id: string): Promise<void> {
    await this.dbContext.update(schema.posPlatform)
      .set({
        isDeleted: true,
        deletedAt: new Date().toISOString()
      })
      .where(eq(schema.posPlatform.id, id));
  }

  async isPositionInUse(id: string): Promise<boolean> {
    const activeAssignments = await this.dbContext.select({ id: schema.empAssignment.id })
      .from(schema.empAssignment)
      .where(
        and(
          eq(schema.empAssignment.positionId, id),
          eq(schema.empAssignment.status, "ACTIVE"),
          eq(schema.empAssignment.isDeleted, false)
        )
      )
      .limit(1);

    return activeAssignments.length > 0;
  }

  async search(query: any): Promise<{ data: any[], pagination: any }> {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const conditions = [eq(schema.posPlatform.isDeleted, false)];
    
    if (query.q) {
      conditions.push(
        or(
          like(schema.posPlatform.code, `%${query.q}%`),
          like(schema.posPlatform.name, `%${query.q}%`)
        )
      );
    }
    if (query.companyId) conditions.push(eq(schema.posPlatform.companyId, query.companyId));
    if (query.status) conditions.push(eq(schema.posPlatform.status, query.status));
    
    const data = await this.dbContext.select().from(schema.posPlatform)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(asc(schema.posPlatform.name));
    
    const totalCount = await this.dbContext.select({ id: schema.posPlatform.id })
      .from(schema.posPlatform)
      .where(and(...conditions));
    
    return {
      data,
      pagination: {
        total: totalCount.length,
        page,
        limit
      }
    };
  }

  private mapToDomain(record: any): Position {
    return Position.create(
      record.id,
      record.code,
      record.name,
      record.companyId,
      record.jobId,
      record.employmentType,
      record.status,
      record.effectiveDate,
      record.isActive,
      record.isDeleted,
      record.version
    );
  }
}
