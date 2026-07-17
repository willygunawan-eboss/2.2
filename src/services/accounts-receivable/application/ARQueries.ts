import { db } from '../../../db';
import { invoices } from '../../../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { InvoiceStatus } from '../domain/CustomerInvoice';

export class ARQueries {
  static async getOutstandingInvoices(customerId?: string) {
    let conditions = sql`${invoices.status} IN ('POSTED', 'PARTIALLY_PAID') AND ${invoices.amountDue} > 0`;
    if (customerId) {
      conditions = and(conditions, eq(invoices.customerId, customerId));
    }
    
    const outstanding = await db.select().from(invoices).where(conditions).all();
    return outstanding;
  }
}
