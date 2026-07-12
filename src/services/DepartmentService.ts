import { db } from "../db/index.js";
import { eq, desc, asc, like, and, isNull, or } from "drizzle-orm";
import crypto from "crypto";
import * as schema from "../db/schema.js";

export class DepartmentService {
  static notDeleted() {
    return isNull(schema.departments.deletedAt);
  }

  static async logAudit(departmentId: string, action: string, changes: any, username: string) {
    await db.insert(schema.departmentAudits).values({
      id: crypto.randomUUID(),
      departmentId,
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
    
    if (query.companyId) conditions.push(eq(schema.departments.companyId, query.companyId));
    if (query.branchId) conditions.push(eq(schema.departments.branchId, query.branchId));
    if (query.divisionId) conditions.push(eq(schema.departments.divisionId, query.divisionId));
    if (query.status) conditions.push(eq(schema.departments.status, query.status));
    
    if (search) {
      conditions.push(
        or(
          like(schema.departments.code, `%${search}%`),
          like(schema.departments.name, `%${search}%`)
        )!
      );
    }

    const data = await db
      .select({
        id: schema.departments.id,
        companyId: schema.departments.companyId,
        companyName: schema.companies.name,
        branchId: schema.departments.branchId,
        branchName: schema.branches.name,
        divisionId: schema.departments.divisionId,
        divisionName: schema.divisions.name,
        managerPositionId: schema.departments.managerPositionId,
        code: schema.departments.code,
        name: schema.departments.name,
        description: schema.departments.description,
        costCenter: schema.departments.costCenter,
        status: schema.departments.status,
        isActive: schema.departments.isActive,
        deletedAt: schema.departments.deletedAt,
        createdAt: schema.departments.createdAt,
      })
      .from(schema.departments)
      .leftJoin(schema.companies, eq(schema.departments.companyId, schema.companies.id))
      .leftJoin(schema.branches, eq(schema.departments.branchId, schema.branches.id))
      .leftJoin(schema.divisions, eq(schema.departments.divisionId, schema.divisions.id))
      .where(conditions.length ? and(...conditions) : undefined)
      // @ts-ignore
      .orderBy(sortOrder(schema.departments[sortBy] || schema.departments.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: schema.departments.id })
      .from(schema.departments)
      .where(conditions.length ? and(...conditions) : undefined);

    return {
      data,
      pagination: { total: totalResult.length, page, limit }
    };
  }

  static async getById(id: string) {
    const data = await db.select().from(schema.departments).where(eq(schema.departments.id, id));
    return data.length ? data[0] : null;
  }

  static async getAudits(departmentId: string) {
    const data = await db.select()
      .from(schema.departmentAudits)
      .where(eq(schema.departmentAudits.departmentId, departmentId))
      .orderBy(desc(schema.departmentAudits.performedAt));
    return data;
  }

  static async create(data: any, username: string) {
    const id = crypto.randomUUID();
    const insertData = {
      ...data,
      id,
      createdBy: username || "system"
    };

    await db.insert(schema.departments).values(insertData);
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

    await db.update(schema.departments)
      .set(updateData)
      .where(eq(schema.departments.id, id));

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

    await db.update(schema.departments)
      .set({
        deletedAt: new Date().toISOString(),
        deletedBy: username || "system"
      })
      .where(eq(schema.departments.id, id));

    await this.logAudit(id, 'DELETE', null, username);
    return true;
  }

  static async restore(id: string, username: string) {
    const existing = await this.getById(id);
    if (!existing) return false;

    await db.update(schema.departments)
      .set({
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date().toISOString(),
        updatedBy: username || "system"
      })
      .where(eq(schema.departments.id, id));

    await this.logAudit(id, 'RESTORE', null, username);
    return true;
  }
}
