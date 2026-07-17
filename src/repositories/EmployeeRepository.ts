import { db } from '../db';
import { employees } from '../db/schema';
import { eq, and, like, or, desc, asc, sql } from 'drizzle-orm';

export class EmployeeRepository {
  constructor(private readonly tx?: any) {}
  async findAll(filters: any = {}) {
    const conditions = [];
    if (filters.status) conditions.push(eq(employees.status, filters.status));
    if (filters.employmentStatus) conditions.push(eq(employees.employmentStatus, filters.employmentStatus));
    if (filters.keyword) {
      conditions.push(or(
        like(employees.employeeNumber, `%\${filters.keyword}%`),
        like(employees.name, `%\${filters.keyword}%`),
        like(employees.email, `%\${filters.keyword}%`)
      ));
    }

    let query = (this.tx || db).query.employees.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(employees.createdAt)]
    });

    return await query;
  }

  async findById(id: string) {
    return await (this.tx || db).query.employees.findFirst({
      where: eq(employees.id, id),
    });
  }

  async findByEmployeeNumber(employeeNumber: string) {
    return await (this.tx || db).query.employees.findFirst({
      where: eq(employees.employeeNumber, employeeNumber)
    });
  }

  async findByCorporateEmail(email: string) {
    return await (this.tx || db).query.employees.findFirst({
      where: eq(employees.email, email)
    });
  }

  async findByNik(nik: string) {
    return await (this.tx || db).query.employees.findFirst({
      where: eq(employees.nationalIdentityNumber, nik)
    });
  }

  async create(data: any) {
    const [record] = await (this.tx || db).insert(employees).values(data).returning();
    return record;
  }

  async update(id: string, data: any) {
    const [record] = await (this.tx || db).update(employees)
      .set({ ...data, updatedAt: sql`CURRENT_TIMESTAMP` })
      .where(eq(employees.id, id))
      .returning();
    return record;
  }

  async softDelete(id: string, deletedBy: string) {
    const [record] = await (this.tx || db).update(employees)
      .set({ 
        status: 'Inactive', 
        deletedAt: sql`CURRENT_TIMESTAMP`,
        deletedBy
      })
      .where(eq(employees.id, id))
      .returning();
    return record;
  }

  async restore(id: string, updatedBy: string) {
    const [record] = await (this.tx || db).update(employees)
      .set({ 
        status: 'Active',
        deletedAt: null,
        deletedBy: null,
        updatedAt: sql`CURRENT_TIMESTAMP`,
        updatedBy
      })
      .where(eq(employees.id, id))
      .returning();
    return record;
  }
}
