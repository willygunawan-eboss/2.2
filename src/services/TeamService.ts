import { db } from "../db/index.js";
import { eq, desc, asc, like, and, isNull, or } from "drizzle-orm";
import crypto from "crypto";
import * as schema from "../db/schema.js";

export class TeamService {
  static notDeleted() {
    return isNull(schema.teams.deletedAt);
  }

  static async logAudit(teamId: string, action: string, changes: any, username: string) {
    await db.insert(schema.teamAudits).values({
      id: crypto.randomUUID(),
      teamId,
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
    
    if (query.companyId) conditions.push(eq(schema.teams.companyId, query.companyId));
    if (query.branchId) conditions.push(eq(schema.teams.branchId, query.branchId));
    if (query.divisionId) conditions.push(eq(schema.teams.divisionId, query.divisionId));
    if (query.departmentId) conditions.push(eq(schema.teams.departmentId, query.departmentId));
    if (query.sectionId) conditions.push(eq(schema.teams.sectionId, query.sectionId));
    if (query.status) conditions.push(eq(schema.teams.status, query.status));
    
    if (search) {
      conditions.push(
        or(
          like(schema.teams.code, `%${search}%`),
          like(schema.teams.name, `%${search}%`)
        )!
      );
    }

    const data = await db
      .select({
        id: schema.teams.id,
        companyId: schema.teams.companyId,
        companyName: schema.companies.name,
        branchId: schema.teams.branchId,
        branchName: schema.branches.name,
        divisionId: schema.teams.divisionId,
        divisionName: schema.divisions.name,
        departmentId: schema.teams.departmentId,
        departmentName: schema.departments.name,
        sectionId: schema.teams.sectionId,
        sectionName: schema.sections.name,
        code: schema.teams.code,
        name: schema.teams.name,
        description: schema.teams.description,
        status: schema.teams.status,
        isActive: schema.teams.isActive,
        deletedAt: schema.teams.deletedAt,
        createdAt: schema.teams.createdAt,
      })
      .from(schema.teams)
      .leftJoin(schema.companies, eq(schema.teams.companyId, schema.companies.id))
      .leftJoin(schema.branches, eq(schema.teams.branchId, schema.branches.id))
      .leftJoin(schema.divisions, eq(schema.teams.divisionId, schema.divisions.id))
      .leftJoin(schema.departments, eq(schema.teams.departmentId, schema.departments.id))
      .leftJoin(schema.sections, eq(schema.teams.sectionId, schema.sections.id))
      .where(conditions.length ? and(...conditions) : undefined)
      // @ts-ignore
      .orderBy(sortOrder(schema.teams[sortBy] || schema.teams.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: schema.teams.id })
      .from(schema.teams)
      .where(conditions.length ? and(...conditions) : undefined);

    return {
      data,
      pagination: { total: totalResult.length, page, limit }
    };
  }

  static async getById(id: string) {
    const data = await db.select().from(schema.teams).where(eq(schema.teams.id, id));
    return data.length ? data[0] : null;
  }

  static async getAudits(teamId: string) {
    const data = await db.select()
      .from(schema.teamAudits)
      .where(eq(schema.teamAudits.teamId, teamId))
      .orderBy(desc(schema.teamAudits.performedAt));
    return data;
  }

  static async create(data: any, username: string) {
    const id = crypto.randomUUID();
    const insertData = {
      ...data,
      id,
      createdBy: username || "system"
    };

    await db.insert(schema.teams).values(insertData);
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

    await db.update(schema.teams)
      .set(updateData)
      .where(eq(schema.teams.id, id));

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

    await db.update(schema.teams)
      .set({
        deletedAt: new Date().toISOString(),
        deletedBy: username || "system"
      })
      .where(eq(schema.teams.id, id));

    await this.logAudit(id, 'DELETE', null, username);
    return true;
  }

  static async restore(id: string, username: string) {
    const existing = await this.getById(id);
    if (!existing) return false;

    await db.update(schema.teams)
      .set({
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date().toISOString(),
        updatedBy: username || "system"
      })
      .where(eq(schema.teams.id, id));

    await this.logAudit(id, 'RESTORE', null, username);
    return true;
  }
}
