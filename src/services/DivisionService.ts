import { db } from "../db/index.js";
import { eq, desc, asc, like, and, isNull, or } from "drizzle-orm";
import crypto from "crypto";
import * as schema from "../db/schema.js";

export class DivisionService {
  static notDeleted() {
    return isNull(schema.divisions.deletedAt);
  }

  static async logAudit(divisionId: string, action: string, changes: any, username: string) {
    await db.insert(schema.divisionAudits).values({
      id: crypto.randomUUID(),
      divisionId,
      action,
      changes: changes ? JSON.stringify(changes) : null,
      performedBy: username || 'system',
      performedAt: new Date().toISOString()
    });
  }

  static async list(query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = (query.search as string) || "";
    const sortBy = (query.sortBy as string) || "createdAt";
    const sortOrder = (query.sortOrder as string) === "asc" ? asc : desc;
    
    const showDeleted = query.showDeleted === 'true';
    const conditions = showDeleted ? [] : [this.notDeleted()];
    
    if (query.companyId) conditions.push(eq(schema.divisions.companyId, query.companyId));
    if (query.branchId) conditions.push(eq(schema.divisions.branchId, query.branchId));
    if (query.status) conditions.push(eq(schema.divisions.status, query.status));
    
    if (search) {
      conditions.push(
        or(
          like(schema.divisions.code, `%${search}%`),
          like(schema.divisions.name, `%${search}%`)
        )!
      );
    }

    const data = await db
      .select({
        id: schema.divisions.id,
        companyId: schema.divisions.companyId,
        companyName: schema.companies.name,
        branchId: schema.divisions.branchId,
        branchName: schema.branches.name,
        code: schema.divisions.code,
        name: schema.divisions.name,
        description: schema.divisions.description,
        status: schema.divisions.status,
        isActive: schema.divisions.isActive,
        deletedAt: schema.divisions.deletedAt,
        createdAt: schema.divisions.createdAt,
      })
      .from(schema.divisions)
      .leftJoin(schema.companies, eq(schema.divisions.companyId, schema.companies.id))
      .leftJoin(schema.branches, eq(schema.divisions.branchId, schema.branches.id))
      .where(conditions.length ? and(...conditions) : undefined)
      // @ts-ignore
      .orderBy(sortOrder(schema.divisions[sortBy] || schema.divisions.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: schema.divisions.id })
      .from(schema.divisions)
      .where(conditions.length ? and(...conditions) : undefined);

    return {
      data,
      pagination: { total: totalResult.length, page, limit }
    };
  }

  static async getById(id: string) {
    const data = await db.select().from(schema.divisions).where(eq(schema.divisions.id, id));
    return data.length ? data[0] : null;
  }

  static async getAudits(divisionId: string) {
    const data = await db.select()
      .from(schema.divisionAudits)
      .where(eq(schema.divisionAudits.divisionId, divisionId))
      .orderBy(desc(schema.divisionAudits.performedAt));
    return data;
  }

  static async create(data: any, username: string) {
    const id = crypto.randomUUID();
    const insertData = {
      ...data,
      id,
      createdBy: username || "system"
    };

    await db.insert(schema.divisions).values(insertData);
    await this.logAudit(id, 'CREATE', data, username);

    return { id, ...data };
  }

  static async update(id: string, data: any, username: string) {
    const existing = await this.getById(id);
    if (!existing) return false;

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: username || "system"
    };

    await db.update(schema.divisions)
      .set(updateData)
      .where(eq(schema.divisions.id, id));

    const changes: any = {};
    for (const key of Object.keys(data)) {
      // @ts-ignore
      if (existing[key] !== data[key]) {
        // @ts-ignore
        changes[key] = { from: existing[key], to: data[key] };
      }
    }

    if (Object.keys(changes).length > 0) {
      await this.logAudit(id, 'UPDATE', changes, username);
    }

    return true;
  }

  static async delete(id: string, username: string) {
    const existing = await this.getById(id);
    if (!existing) return false;

    await db.update(schema.divisions)
      .set({
        deletedAt: new Date().toISOString(),
        deletedBy: username || "system"
      })
      .where(eq(schema.divisions.id, id));

    await this.logAudit(id, 'DELETE', null, username);
    return true;
  }

  static async restore(id: string, username: string) {
    const existing = await this.getById(id);
    if (!existing) return false;

    await db.update(schema.divisions)
      .set({
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date().toISOString(),
        updatedBy: username || "system"
      })
      .where(eq(schema.divisions.id, id));

    await this.logAudit(id, 'RESTORE', null, username);
    return true;
  }
}
