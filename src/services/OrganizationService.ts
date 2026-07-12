import { db } from "../db/index.js";
import { eq, desc, asc, like, and, isNull, or } from "drizzle-orm";
import crypto from "crypto";

import * as schema from "../db/schema.js";

export class OrganizationService {

  static async checkReadiness(path: string) {
    if (path === 'employees') {
      const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      if (!comp.length) return { success: false, message: 'Silakan lengkapi Master Company terlebih dahulu di menu Organization.' };
      const branch = await db.select({ id: schema.branches.id }).from(schema.branches).limit(1);
      if (!branch.length) return { success: false, message: 'Silakan lengkapi Master Branch terlebih dahulu.' };
      const dept = await db.select({ id: schema.departments.id }).from(schema.departments).limit(1);
      if (!dept.length) return { success: false, message: 'Silakan lengkapi Master Department terlebih dahulu.' };
      const pos = await db.select({ id: schema.positions.id }).from(schema.positions).limit(1);
      if (!pos.length) return { success: false, message: 'Silakan lengkapi Master Position terlebih dahulu.' };
    } else if (path === 'branches') {
      const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      if (!comp.length) return { success: false, message: 'Silakan lengkapi Master Company terlebih dahulu.' };
    } else if (path === 'departments') {
      const comp = await db.select({ id: schema.companies.id }).from(schema.companies).limit(1);
      if (!comp.length) return { success: false, message: 'Silakan lengkapi Master Company terlebih dahulu.' };
    } else if (path === 'positions') {
      const dept = await db.select({ id: schema.departments.id }).from(schema.departments).limit(1);
      if (!dept.length) return { success: false, message: 'Silakan lengkapi Master Department terlebih dahulu.' };
    }
    return { success: true };
  }

  static notDeleted(table: any) {
    return isNull(table.deletedAt);
  }

  static async list(table: any, query: any, searchFields: any[]) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const search = (query.search as string) || "";
    const sortBy = (query.sortBy as string) || "createdAt";
    const sortOrder = (query.sortOrder as string) === "asc" ? asc : desc;

    const conditions = [this.notDeleted(table)];
        
    if (search && searchFields.length > 0) {
      const searchConditions = searchFields.map(field => like(field, `%${search}%`));
      conditions.push(or(...searchConditions)!);
    }

    const data = await db
      .select()
      .from(table)
      .where(and(...conditions))
      .orderBy(sortOrder(table[sortBy] || table.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: table.id })
      .from(table)
      .where(and(...conditions));
            
    return {
      data,
      pagination: { total: totalResult.length, page, limit }
    };
  }

  static async getById(table: any, id: string) {
    const data = await db.select().from(table).where(and(eq(table.id, id), this.notDeleted(table)));
    return data.length ? data[0] : null;
  }

  static async create(table: any, data: any, username: string) {
    const id = crypto.randomUUID();
    const insertData = {
      ...data,
      id,
      createdBy: username || "system"
    };
    await db.insert(table).values(insertData);
    return { id, ...data };
  }

  static async update(table: any, id: string, data: any, username: string) {
    const existing = await this.getById(table, id);
    if (!existing) return false;

    await db.update(table)
      .set({
        ...data,
        updatedAt: new Date().toISOString(),
        updatedBy: username || "system"
      })
      .where(eq(table.id, id));
    
    return true;
  }

  static async delete(table: any, id: string, username: string) {
    const existing = await this.getById(table, id);
    if (!existing) return false;

    await db.update(table)
      .set({
        deletedAt: new Date().toISOString(),
        deletedBy: username || "system"
      })
      .where(eq(table.id, id));
    
    return true;
  }
  
  static async getReferences(schema: any) {
    const companies = await db.select({ id: schema.companies.id, name: schema.companies.name }).from(schema.companies).where(this.notDeleted(schema.companies));
    const branches = await db.select({ id: schema.branches.id, name: schema.branches.name, companyId: schema.branches.companyId }).from(schema.branches).where(this.notDeleted(schema.branches));
    const divisions = await db.select({ id: schema.divisions.id, name: schema.divisions.name, companyId: schema.divisions.companyId, branchId: schema.divisions.branchId }).from(schema.divisions).where(this.notDeleted(schema.divisions));
    const departments = await db.select({ id: schema.departments.id, name: schema.departments.name, divisionId: schema.departments.divisionId }).from(schema.departments).where(this.notDeleted(schema.departments));
    const sections = await db.select({ id: schema.sections.id, name: schema.sections.name, departmentId: schema.sections.departmentId }).from(schema.sections).where(this.notDeleted(schema.sections));
    const teams = await db.select({ id: schema.teams.id, name: schema.teams.name, sectionId: schema.teams.sectionId }).from(schema.teams).where(this.notDeleted(schema.teams));
    const jobGrades = await db.select({ id: schema.jobGrades.id, name: schema.jobGrades.name }).from(schema.jobGrades).where(this.notDeleted(schema.jobGrades));
    const positions = await db.select({ id: schema.positions.id, name: schema.positions.name, departmentId: schema.positions.departmentId }).from(schema.positions).where(this.notDeleted(schema.positions));
    
    return {
      companies,
      branches,
      divisions,
      departments,
      sections,
      teams,
      jobGrades,
      positions
    };
  }
}
