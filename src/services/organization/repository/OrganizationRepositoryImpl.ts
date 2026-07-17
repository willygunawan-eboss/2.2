import { asc, desc, like, eq, and, isNull } from "drizzle-orm";
import { IOrganizationRepository } from "./IOrganizationRepository.js";
import { Organization } from "../domain/Organization.js";
import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";

export class OrganizationRepositoryImpl implements IOrganizationRepository {
  constructor(private readonly tx?: any) {}

  private get dbContext() {
    return this.tx || db;
  }

  async executeInTransaction<T>(operation: (repo: IOrganizationRepository) => Promise<T>): Promise<T> {
    if (this.tx) {
      return operation(this);
    }
    return this.dbContext.transaction(async (tx) => {
      const transactionalRepo = new OrganizationRepositoryImpl(tx);
      return operation(transactionalRepo);
    });
  }

  async findDescendants(id: string): Promise<Organization[]> {
    const allRecords = await this.dbContext.select().from(schema.orgPlatform).where(eq(schema.orgPlatform.isDeleted, false)).all();
    const descendants: any[] = [];
    
    // Recursive function to find all children
    const findChildrenRecursive = (parentId: string) => {
      const children = allRecords.filter(r => r.parentId === parentId);
      for (const child of children) {
        descendants.push(child);
        findChildrenRecursive(child.id);
      }
    };
    
    findChildrenRecursive(id);
    return descendants.map(r => this.mapToDomain(r));
  }

  async findById(id: string): Promise<Organization | null> {
    const record = await this.dbContext.select().from(schema.orgPlatform).where(eq(schema.orgPlatform.id, id)).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findByCode(code: string): Promise<Organization | null> {
    const record = await this.dbContext.select().from(schema.orgPlatform).where(eq(schema.orgPlatform.code, code)).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async findChildren(parentId: string): Promise<Organization[]> {
    const records = await this.dbContext.select().from(schema.orgPlatform).where(
      and(
        eq(schema.orgPlatform.parentId, parentId),
        eq(schema.orgPlatform.isDeleted, false)
      )
    ).all();
    return records.map(r => this.mapToDomain(r));
  }

  
  async findRoot(): Promise<Organization | null> {
    const record = await this.dbContext.select().from(schema.orgPlatform).where(
      and(
        isNull(schema.orgPlatform.parentId),
        eq(schema.orgPlatform.isDeleted, false)
      )
    ).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }

  async save(org: Organization): Promise<void> {
    await this.dbContext.insert(schema.orgPlatform).values({
      id: org.id,
      code: org.code,
      name: org.name,
      type: org.type,
      level: org.level,
      parentId: org.parentId,
      path: org.path,
      isActive: org.isActive,
      isDeleted: org.isDeleted,
      version: org.version,
      createdAt: new Date().toISOString()
    });
  }

  async update(org: Organization): Promise<void> {
    await this.dbContext.update(schema.orgPlatform)
      .set({
        code: org.code,
        name: org.name,
        type: org.type,
        level: org.level,
        parentId: org.parentId,
        path: org.path,
        isActive: org.isActive,
        isDeleted: org.isDeleted,
        version: org.version,
        updatedAt: new Date().toISOString()
      })
      .where(eq(schema.orgPlatform.id, org.id));
  }

  async delete(id: string): Promise<void> {
    // Soft delete
    await this.dbContext.update(schema.orgPlatform)
      .set({
        isDeleted: true,
        deletedAt: new Date().toISOString()
      })
      .where(eq(schema.orgPlatform.id, id));
  }

  async exists(id: string): Promise<boolean> {
    const record = await this.dbContext.select({ id: schema.orgPlatform.id }).from(schema.orgPlatform).where(eq(schema.orgPlatform.id, id)).get();
    return !!record;
  }

  async getTree(): Promise<any[]> {
    const allOrgs = await this.dbContext.select().from(schema.orgPlatform)
      .where(eq(schema.orgPlatform.isDeleted, false))
      .orderBy(asc(schema.orgPlatform.level));

    const tree: any[] = [];
    const lookup = new Map();

    allOrgs.forEach(org => {
      lookup.set(org.id, { ...org, children: [] });
    });

    allOrgs.forEach(org => {
      const node = lookup.get(org.id);
      if (org.parentId && lookup.has(org.parentId)) {
        lookup.get(org.parentId).children.push(node);
      } else {
        tree.push(node);
      }
    });

    return tree;
  }

  async search(query: any): Promise<{ data: any[], pagination: any }> {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;
    
    const conditions = [eq(schema.orgPlatform.isDeleted, false)];
    
    if (query.code) conditions.push(like(schema.orgPlatform.code, `%${query.code}%`));
    if (query.name) conditions.push(like(schema.orgPlatform.name, `%${query.name}%`));
    if (query.type) conditions.push(eq(schema.orgPlatform.type, query.type));
    if (query.parentId) conditions.push(eq(schema.orgPlatform.parentId, query.parentId));
    
    const data = await this.dbContext.select().from(schema.orgPlatform)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(schema.orgPlatform.createdAt));

    const totalCount = await this.dbContext.select({ id: schema.orgPlatform.id }).from(schema.orgPlatform).where(and(...conditions));
    
    return {
      data,
      pagination: {
        total: totalCount.length,
        page,
        limit
      }
    };
  }

  private mapToDomain(record: any): Organization {
    return Organization.create(
      record.id,
      record.code,
      record.name,
      record.type,
      record.parentId,
      record.level,
      record.path,
      record.isActive,
      record.isDeleted,
      record.version
    );
  }
}
