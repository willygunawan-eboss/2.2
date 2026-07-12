import { db } from "../db/index.js";
import { eq, desc, asc, like, and, isNull, or } from "drizzle-orm";
import crypto from "crypto";
import * as schema from "../db/schema.js";

export class SectionService {
  static notDeleted() {
    return isNull(schema.sections.deletedAt);
  }

  static async logAudit(sectionId: string, action: string, changes: any, username: string) {
    await db.insert(schema.sectionAudits).values({
      id: crypto.randomUUID(),
      sectionId,
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
    
    if (query.companyId) conditions.push(eq(schema.sections.companyId, query.companyId));
    if (query.branchId) conditions.push(eq(schema.sections.branchId, query.branchId));
    if (query.divisionId) conditions.push(eq(schema.sections.divisionId, query.divisionId));
    if (query.departmentId) conditions.push(eq(schema.sections.departmentId, query.departmentId));
    if (query.status) conditions.push(eq(schema.sections.status, query.status));
    
    if (search) {
      conditions.push(
        or(
          like(schema.sections.code, `%${search}%`),
          like(schema.sections.name, `%${search}%`)
        )!
      );
    }

    const data = await db
      .select({
        id: schema.sections.id,
        companyId: schema.sections.companyId,
        companyName: schema.companies.name,
        branchId: schema.sections.branchId,
        branchName: schema.branches.name,
        divisionId: schema.sections.divisionId,
        divisionName: schema.divisions.name,
        departmentId: schema.sections.departmentId,
        departmentName: schema.departments.name,
        code: schema.sections.code,
        name: schema.sections.name,
        description: schema.sections.description,
        status: schema.sections.status,
        isActive: schema.sections.isActive,
        deletedAt: schema.sections.deletedAt,
        createdAt: schema.sections.createdAt,
      })
      .from(schema.sections)
      .leftJoin(schema.companies, eq(schema.sections.companyId, schema.companies.id))
      .leftJoin(schema.branches, eq(schema.sections.branchId, schema.branches.id))
      .leftJoin(schema.divisions, eq(schema.sections.divisionId, schema.divisions.id))
      .leftJoin(schema.departments, eq(schema.sections.departmentId, schema.departments.id))
      .where(conditions.length ? and(...conditions) : undefined)
      // @ts-ignore
      .orderBy(sortOrder(schema.sections[sortBy] || schema.sections.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: schema.sections.id })
      .from(schema.sections)
      .where(conditions.length ? and(...conditions) : undefined);

    return {
      data,
      pagination: { total: totalResult.length, page, limit }
    };
  }

  static async getById(id: string) {
    const data = await db.select().from(schema.sections).where(eq(schema.sections.id, id));
    return data.length ? data[0] : null;
  }

  static async getAudits(sectionId: string) {
    const data = await db.select()
      .from(schema.sectionAudits)
      .where(eq(schema.sectionAudits.sectionId, sectionId))
      .orderBy(desc(schema.sectionAudits.performedAt));
    return data;
  }

  static async create(data: any, username: string) {
    const id = crypto.randomUUID();
    const insertData = {
      ...data,
      id,
      createdBy: username || "system"
    };

    await db.insert(schema.sections).values(insertData);
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

    await db.update(schema.sections)
      .set(updateData)
      .where(eq(schema.sections.id, id));

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

    await db.update(schema.sections)
      .set({
        deletedAt: new Date().toISOString(),
        deletedBy: username || "system"
      })
      .where(eq(schema.sections.id, id));

    await this.logAudit(id, 'DELETE', null, username);
    return true;
  }

  static async restore(id: string, username: string) {
    const existing = await this.getById(id);
    if (!existing) return false;

    await db.update(schema.sections)
      .set({
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date().toISOString(),
        updatedBy: username || "system"
      })
      .where(eq(schema.sections.id, id));

    await this.logAudit(id, 'RESTORE', null, username);
    return true;
  }
}
