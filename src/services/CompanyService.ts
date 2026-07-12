import { db } from "../db/index.js";
import { eq, desc, asc, like, and, isNull, isNotNull, or } from "drizzle-orm";
import crypto from "crypto";
import * as schema from "../db/schema.js";

export class CompanyService {
  static notDeleted() {
    return isNull(schema.companies.deletedAt);
  }

  static async logAudit(companyId: string, action: string, changes: any, username: string) {
    await db.insert(schema.companyAudits).values({
      id: crypto.randomUUID(),
      companyId,
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
    
    // Default to hiding deleted, unless explicitly requested
    const showDeleted = query.showDeleted === 'true';
    
    const conditions = showDeleted ? [] : [this.notDeleted()];
    
    // Advanced Filters
    if (query.status) conditions.push(eq(schema.companies.status, query.status));
    if (query.industry) conditions.push(eq(schema.companies.industry, query.industry));
    if (query.isActive !== undefined) conditions.push(eq(schema.companies.isActive, query.isActive === 'true'));
    
    if (search) {
      conditions.push(
        or(
          like(schema.companies.code, `%${search}%`),
          like(schema.companies.name, `%${search}%`),
          like(schema.companies.email, `%${search}%`),
          like(schema.companies.phone, `%${search}%`)
        )!
      );
    }

    const data = await db
      .select()
      .from(schema.companies)
      .where(conditions.length ? and(...conditions) : undefined)
      // @ts-ignore
      .orderBy(sortOrder(schema.companies[sortBy] || schema.companies.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: schema.companies.id })
      .from(schema.companies)
      .where(conditions.length ? and(...conditions) : undefined);

    return {
      data,
      pagination: { total: totalResult.length, page, limit }
    };
  }

  static async getById(id: string) {
    const data = await db.select().from(schema.companies).where(eq(schema.companies.id, id));
    return data.length ? data[0] : null;
  }

  static async getAudits(companyId: string) {
    const data = await db.select()
      .from(schema.companyAudits)
      .where(eq(schema.companyAudits.companyId, companyId))
      .orderBy(desc(schema.companyAudits.performedAt));
    return data;
  }

  static async create(data: any, username: string) {
    // If it's the first company or explicitly set as default, we might need to handle uniqueness of default
    const existingDefault = await db.select().from(schema.companies).where(and(eq(schema.companies.isDefault, true), this.notDeleted()));
    
    if (data.isDefault && existingDefault.length > 0) {
      // Remove default from others
      await db.update(schema.companies).set({ isDefault: false }).where(eq(schema.companies.isDefault, true));
    } else if (existingDefault.length === 0) {
      // Force this to be default if no other default exists
      data.isDefault = true;
    }

    const id = crypto.randomUUID();
    const insertData = {
      ...data,
      id,
      createdBy: username || "system"
    };

    await db.insert(schema.companies).values(insertData);
    
    await this.logAudit(id, 'CREATE', data, username);

    return { id, ...data };
  }

  static async update(id: string, data: any, username: string) {
    const existing = await this.getById(id);
    if (!existing) return false;

    if (data.isDefault && !existing.isDefault) {
      // Remove default from others
      await db.update(schema.companies).set({ isDefault: false }).where(eq(schema.companies.isDefault, true));
    }

    // Default company cannot be unset directly, another company must be set as default
    if (data.isDefault === false && existing.isDefault) {
      throw new Error("Cannot unset the default company. Set another company as default instead.");
    }

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
      updatedBy: username || "system"
    };

    await db.update(schema.companies)
      .set(updateData)
      .where(eq(schema.companies.id, id));

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

    if (existing.isDefault) {
      throw new Error("Default company cannot be deleted.");
    }

    await db.update(schema.companies)
      .set({
        deletedAt: new Date().toISOString(),
        deletedBy: username || "system"
      })
      .where(eq(schema.companies.id, id));

    await this.logAudit(id, 'DELETE', null, username);
    return true;
  }

  static async restore(id: string, username: string) {
    const existing = await this.getById(id);
    if (!existing) return false;

    await db.update(schema.companies)
      .set({
        deletedAt: null,
        deletedBy: null,
        updatedAt: new Date().toISOString(),
        updatedBy: username || "system"
      })
      .where(eq(schema.companies.id, id));

    await this.logAudit(id, 'RESTORE', null, username);
    return true;
  }
}
