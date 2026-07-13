import { db } from "../db/index.js";
import { eq, desc, asc, like, and, isNull, or } from "drizzle-orm";
import crypto from "crypto";
import * as schema from "../db/schema.js";

export class BranchService {
  static notDeleted() {
    return isNull(schema.branches.deletedAt);
  }

  static async logAudit(branchId: string, action: string, changes: any, username: string) {
    await db.insert(schema.branchAudits).values({
      id: crypto.randomUUID(),
      branchId,
      action,
      changes: JSON.stringify(changes),
      performedBy: username,
    });
  }

  static async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDir?: "asc" | "desc";
    companyId?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    let conditions = [this.notDeleted()];

    if (params.search) {
      conditions.push(
        or(
          like(schema.branches.code, `%${params.search}%`),
          like(schema.branches.name, `%${params.search}%`)
        )
      );
    }

    if (params.companyId) {
      conditions.push(eq(schema.branches.companyId, params.companyId));
    }

    const whereClause = and(...conditions);

    let orderByClause = desc(schema.branches.createdAt);
    if (params.sortBy) {
      const dir = params.sortDir === "asc" ? asc : desc;
      if (params.sortBy === "code") orderByClause = dir(schema.branches.code);
      if (params.sortBy === "name") orderByClause = dir(schema.branches.name);
      if (params.sortBy === "companyId") orderByClause = dir(schema.branches.companyId);
    }

    const data = await db
      .select({
        id: schema.branches.id,
        code: schema.branches.code,
        name: schema.branches.name,
        companyId: schema.branches.companyId,
        isActive: schema.branches.isActive,
        
        createdAt: schema.branches.createdAt,
        updatedAt: schema.branches.updatedAt,
      })
      .from(schema.branches)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(orderByClause);

    // Get total count
    const countResult = await db
      .select({ id: schema.branches.id })
      .from(schema.branches)
      .where(whereClause);
    
    const total = countResult.length;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string) {
    const records = await db
      .select()
      .from(schema.branches)
      .where(and(eq(schema.branches.id, id), this.notDeleted()))
      .limit(1);
    
    return records[0] || null;
  }

  static async getByCode(code: string) {
    const records = await db
      .select()
      .from(schema.branches)
      .where(and(eq(schema.branches.code, code), this.notDeleted()))
      .limit(1);
    
    return records[0] || null;
  }

  static async create(data: {
    code: string;
    name: string;
    companyId: string;
  }, username: string) {
    const id = crypto.randomUUID();
    
    await db.insert(schema.branches).values({
      id,
      code: data.code,
      name: data.name,
      companyId: data.companyId,
    });

    await this.logAudit(id, "CREATE", data, username);

    return this.getById(id);
  }

  static async update(
    id: string,
    data: {
      name?: string;
      isActive?: boolean;
      },
    username: string
  ) {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error("Branch not found");
    }

    

    const updates: any = {
      
      updatedAt: new Date().toISOString()
    };

    if (data.name !== undefined) updates.name = data.name;
    if (data.isActive !== undefined) updates.isActive = data.isActive;

    await db
      .update(schema.branches)
      .set(updates)
      .where(eq(schema.branches.id, id));

    await this.logAudit(id, "UPDATE", updates, username);

    return this.getById(id);
  }

  
  static async getAudits(branchId: string) {
    return db
      .select()
      .from(schema.branchAudits)
      .where(eq(schema.branchAudits.branchId, branchId))
      .orderBy(desc(schema.branchAudits.performedAt));
  }

  static async delete(id: string, username: string) {
    const existing = await this.getById(id);
    if (!existing) {
      throw new Error("Branch not found");
    }

    // Soft delete
    await db
      .update(schema.branches)
      .set({
        deletedAt: new Date().toISOString(),
        isActive: false
      })
      .where(eq(schema.branches.id, id));

    await this.logAudit(id, "DELETE", { deleted: true }, username);

    return true;
  }
}
