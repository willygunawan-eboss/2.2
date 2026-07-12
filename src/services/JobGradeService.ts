import { db } from "../db/index.js";
import { jobGrades } from "../db/schema.js";
import { eq, desc, asc, like, and, isNull, or, inArray } from "drizzle-orm";
import crypto from "crypto";

export class JobGradeService {
  static async list({ page = 1, limit = 10, search = '', showDeleted = false }) {
    const offset = (page - 1) * limit;
    let conditions = [];

    if (!showDeleted) {
      conditions.push(isNull(jobGrades.deletedAt));
    }

    if (search) {
      conditions.push(or(
        like(jobGrades.code, `%\${search}%`),
        like(jobGrades.name, `%\${search}%`)
      ));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.select().from(jobGrades)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(jobGrades.createdAt));

    const totalRes = await db.select({ count: jobGrades.id }).from(jobGrades).where(whereClause);
    const total = totalRes.length;

    return { data, total, page, limit };
  }

  static async getById(id: string) {
    const data = await db.select().from(jobGrades).where(eq(jobGrades.id, id)).limit(1);
    return data[0] || null;
  }

  static async create(payload: any, userId: string = 'system') {
    const id = crypto.randomUUID();
    await db.insert(jobGrades).values({
      ...payload,
      id,
      createdBy: userId
    });
    return await this.getById(id);
  }

  static async update(id: string, payload: any, userId: string = 'system') {
    await db.update(jobGrades).set({
      ...payload,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    }).where(eq(jobGrades.id, id));
    return await this.getById(id);
  }

  static async delete(id: string, userId: string = 'system') {
    await db.update(jobGrades).set({
      deletedBy: userId,
      deletedAt: new Date().toISOString(),
      isActive: false
    }).where(eq(jobGrades.id, id));
    return true;
  }

  static async restore(id: string, userId: string = 'system') {
    await db.update(jobGrades).set({
      deletedBy: null,
      deletedAt: null,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
      isActive: true
    }).where(eq(jobGrades.id, id));
    return true;
  }
}
