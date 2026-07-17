import { asc, desc, eq, and } from "drizzle-orm";
import { IAssignmentRepository } from "./IAssignmentRepository.js";
import { Assignment } from "../domain/Assignment.js";
import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";

export class AssignmentRepositoryImpl implements IAssignmentRepository {
  constructor(private readonly tx?: any) {}

  private get dbContext() {
    return this.tx || db;
  }

  async executeInTransaction<T>(operation: (repo: IAssignmentRepository) => Promise<T>): Promise<T> {
    if (this.tx) {
      return operation(this);
    }
    return this.dbContext.transaction(async (tx: any) => {
      const transactionalRepo = new AssignmentRepositoryImpl(tx);
      return operation(transactionalRepo);
    });
  }

  async findById(id: string): Promise<Assignment | null> {
    const record = await this.dbContext.select().from(schema.empAssignment).where(eq(schema.empAssignment.id, id)).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findActiveByEmploymentId(employmentId: string): Promise<Assignment | null> {
    const record = await this.dbContext.select().from(schema.empAssignment).where(
      and(
        eq(schema.empAssignment.employmentId, employmentId),
        eq(schema.empAssignment.status, "ACTIVE"),
        eq(schema.empAssignment.isDeleted, false)
      )
    ).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findByEmploymentId(employmentId: string): Promise<Assignment[]> {
    const records = await this.dbContext.select().from(schema.empAssignment).where(
      and(
        eq(schema.empAssignment.employmentId, employmentId),
        eq(schema.empAssignment.isDeleted, false)
      )
    ).orderBy(desc(schema.empAssignment.effectiveDate)).all();
    return records.map((r: any) => this.mapToDomain(r));
  }

  async save(assignment: Assignment): Promise<void> {
    await this.dbContext.insert(schema.empAssignment).values({
      id: assignment.id,
      employmentId: assignment.employmentId,
      organizationId: assignment.organizationId,
      positionId: assignment.positionId,
      managerId: assignment.managerId,
      supervisorId: assignment.supervisorId,
      effectiveDate: assignment.effectiveDate,
      endDate: assignment.endDate,
      status: assignment.status,
      isActive: assignment.isActive,
      isDeleted: assignment.isDeleted,
      version: assignment.version,
      createdAt: new Date().toISOString()
    });
  }

  async update(assignment: Assignment): Promise<void> {
    await this.dbContext.update(schema.empAssignment)
      .set({
        organizationId: assignment.organizationId,
        positionId: assignment.positionId,
        managerId: assignment.managerId,
        supervisorId: assignment.supervisorId,
        effectiveDate: assignment.effectiveDate,
        endDate: assignment.endDate,
        status: assignment.status,
        isActive: assignment.isActive,
        isDeleted: assignment.isDeleted,
        version: assignment.version,
        updatedAt: new Date().toISOString()
      })
      .where(eq(schema.empAssignment.id, assignment.id));
  }

  async delete(id: string): Promise<void> {
    await this.dbContext.update(schema.empAssignment)
      .set({
        isDeleted: true,
        deletedAt: new Date().toISOString()
      })
      .where(eq(schema.empAssignment.id, id));
  }

  async search(query: any): Promise<{ data: any[], pagination: any }> {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const conditions = [eq(schema.empAssignment.isDeleted, false)];
    
    if (query.employmentId) conditions.push(eq(schema.empAssignment.employmentId, query.employmentId));
    if (query.status) conditions.push(eq(schema.empAssignment.status, query.status));
    
    const orgAlias = schema.orgPlatform;
    
    const data = await this.dbContext.select({
      id: schema.empAssignment.id,
      employmentId: schema.empAssignment.employmentId,
      organizationId: schema.empAssignment.organizationId,
      positionId: schema.empAssignment.positionId,
      managerId: schema.empAssignment.managerId,
      supervisorId: schema.empAssignment.supervisorId,
      effectiveDate: schema.empAssignment.effectiveDate,
      endDate: schema.empAssignment.endDate,
      status: schema.empAssignment.status,
      createdAt: schema.empAssignment.createdAt
    }).from(schema.empAssignment)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.empAssignment.effectiveDate));

    // Wait, let's keep the query simple for now since SQLite doesn't natively support multiple joins cleanly without alias, we can fetch references later or join simply.
    // For now we just return the raw data and let the Application Service resolve relations if needed.
    
    const totalCount = await this.dbContext.select({ id: schema.empAssignment.id }).from(schema.empAssignment).where(and(...conditions));
    
    return {
      data,
      pagination: {
        total: totalCount.length,
        page,
        limit
      }
    };
  }

  private mapToDomain(record: any): Assignment {
    return Assignment.create(
      record.id,
      record.employmentId,
      record.organizationId,
      record.positionId,
      record.managerId,
      record.supervisorId,
      record.effectiveDate,
      record.endDate,
      record.status,
      record.isActive,
      record.isDeleted,
      record.version
    );
  }
}
