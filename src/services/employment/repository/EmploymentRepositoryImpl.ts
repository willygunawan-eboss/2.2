import { asc, desc, like, eq, and, isNull } from "drizzle-orm";
import { IEmploymentRepository } from "./IEmploymentRepository.js";
import { Employment } from "../domain/Employment.js";
import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";

export class EmploymentRepositoryImpl implements IEmploymentRepository {
  constructor(private readonly tx?: any) {}

  private get dbContext() {
    return this.tx || db;
  }

  async executeInTransaction<T>(operation: (repo: IEmploymentRepository) => Promise<T>): Promise<T> {
    if (this.tx) {
      return operation(this);
    }
    return this.dbContext.transaction(async (tx: any) => {
      const transactionalRepo = new EmploymentRepositoryImpl(tx);
      return operation(transactionalRepo);
    });
  }

  async findById(id: string): Promise<Employment | null> {
    const record = await this.dbContext.select().from(schema.empPlatform).where(eq(schema.empPlatform.id, id)).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findByEmployeeNumber(employeeNumber: string): Promise<Employment | null> {
    const record = await this.dbContext.select().from(schema.empPlatform).where(eq(schema.empPlatform.employeeNumber, employeeNumber)).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findByOrganization(organizationId: string): Promise<Employment[]> {
    const records = await this.dbContext.select().from(schema.empPlatform).where(
      and(
        eq(schema.empPlatform.organizationId, organizationId),
        eq(schema.empPlatform.isDeleted, false)
      )
    ).all();
    return records.map((r: any) => this.mapToDomain(r));
  }

  async save(emp: Employment): Promise<void> {
    await this.dbContext.insert(schema.empPlatform).values({
      id: emp.id,
      employeeNumber: emp.employeeNumber,
      fullName: emp.fullName,
      organizationId: emp.organizationId,
      employmentType: emp.employmentType,
      status: emp.status,
      joinDate: emp.joinDate,
      terminationDate: emp.terminationDate,
      isActive: emp.isActive,
      isDeleted: emp.isDeleted,
      version: emp.version,
      createdAt: new Date().toISOString()
    });
  }

  async update(emp: Employment): Promise<void> {
    await this.dbContext.update(schema.empPlatform)
      .set({
        employeeNumber: emp.employeeNumber,
        fullName: emp.fullName,
        organizationId: emp.organizationId,
        employmentType: emp.employmentType,
        status: emp.status,
        joinDate: emp.joinDate,
        terminationDate: emp.terminationDate,
        isActive: emp.isActive,
        isDeleted: emp.isDeleted,
        version: emp.version,
        updatedAt: new Date().toISOString()
      })
      .where(eq(schema.empPlatform.id, emp.id));
  }

  async delete(id: string): Promise<void> {
    await this.dbContext.update(schema.empPlatform)
      .set({
        isDeleted: true,
        deletedAt: new Date().toISOString()
      })
      .where(eq(schema.empPlatform.id, id));
  }

  async exists(id: string): Promise<boolean> {
    const record = await this.dbContext.select({ id: schema.empPlatform.id }).from(schema.empPlatform).where(eq(schema.empPlatform.id, id)).get();
    return !!record;
  }

  async search(query: any): Promise<{ data: any[], pagination: any }> {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const conditions = [eq(schema.empPlatform.isDeleted, false)];
    
    if (query.employeeNumber) conditions.push(like(schema.empPlatform.employeeNumber, `%${query.employeeNumber}%`));
    if (query.fullName) conditions.push(like(schema.empPlatform.fullName, `%${query.fullName}%`));
    if (query.organizationId) conditions.push(eq(schema.empPlatform.organizationId, query.organizationId));
    if (query.status) conditions.push(eq(schema.empPlatform.status, query.status));
    if (query.employmentType) conditions.push(eq(schema.empPlatform.employmentType, query.employmentType));
    
    const data = await this.dbContext.select({
      id: schema.empPlatform.id,
      employeeNumber: schema.empPlatform.employeeNumber,
      fullName: schema.empPlatform.fullName,
      organizationId: schema.empPlatform.organizationId,
      organizationName: schema.orgPlatform.name,
      employmentType: schema.empPlatform.employmentType,
      status: schema.empPlatform.status,
      joinDate: schema.empPlatform.joinDate,
      isActive: schema.empPlatform.isActive,
      createdAt: schema.empPlatform.createdAt
    }).from(schema.empPlatform)
      .leftJoin(schema.orgPlatform, eq(schema.empPlatform.organizationId, schema.orgPlatform.id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.empPlatform.createdAt));

    const totalCount = await this.dbContext.select({ id: schema.empPlatform.id }).from(schema.empPlatform).where(and(...conditions));
    
    return {
      data,
      pagination: {
        total: totalCount.length,
        page,
        limit
      }
    };
  }

  private mapToDomain(record: any): Employment {
    return Employment.create(
      record.id,
      record.employeeNumber,
      record.fullName,
      record.organizationId,
      record.employmentType,
      record.status,
      record.joinDate,
      record.terminationDate,
      record.isActive,
      record.isDeleted,
      record.version
    );
  }
}
