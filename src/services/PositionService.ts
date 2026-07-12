import { db } from "../db/index.js";
import { positions } from "../db/schema.js";
import { eq, desc, asc, like, and, isNull, or } from "drizzle-orm";
import crypto from "crypto";

export class PositionService {
  static async list({ page = 1, limit = 10, search = '', showDeleted = false }) {
    const offset = (page - 1) * limit;
    let conditions = [];

    if (!showDeleted) {
      conditions.push(isNull(positions.deletedAt));
    }

    if (search) {
      conditions.push(or(
        like(positions.code, `%\${search}%`),
        like(positions.name, `%\${search}%`)
      ));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const data = await db.select().from(positions)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(positions.createdAt));

    const totalRes = await db.select({ count: positions.id }).from(positions).where(whereClause);
    const total = totalRes.length;

    return { data, total, page, limit };
  }

  static async getById(id: string) {
    const data = await db.select().from(positions).where(eq(positions.id, id)).limit(1);
    return data[0] || null;
  }

  static async create(payload: any, userId: string = 'system') {
    const id = crypto.randomUUID();
    await db.insert(positions).values({
      ...payload,
      id,
      createdBy: userId,
      version: 1
    });
    return await this.getById(id);
  }

  static async update(id: string, payload: any, userId: string = 'system') {
    const current = await this.getById(id);
    const newVersion = (current?.version || 0) + 1;
    await db.update(positions).set({
      ...payload,
      version: newVersion,
      updatedBy: userId,
      updatedAt: new Date().toISOString()
    }).where(eq(positions.id, id));
    return await this.getById(id);
  }

  static async delete(id: string, userId: string = 'system') {
    await db.update(positions).set({
      deletedBy: userId,
      deletedAt: new Date().toISOString(),
      isActive: false
    }).where(eq(positions.id, id));
    return true;
  }

  static async restore(id: string, userId: string = 'system') {
    await db.update(positions).set({
      deletedBy: null,
      deletedAt: null,
      updatedBy: userId,
      updatedAt: new Date().toISOString(),
      isActive: true
    }).where(eq(positions.id, id));
    return true;
  }
}
