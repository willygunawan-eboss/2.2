import { db } from '../../../db';
import { invoices } from '../../../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { InvoiceStatus } from '../domain/VendorInvoice';

export class APQueries {
  static async getOutstandingInvoices(vendorId?: string) {
    let conditions = sql`${invoices.status} IN ('POSTED', 'PARTIALLY_PAID') AND ${invoices.amountDue} > 0`;
    if (vendorId) {
      conditions = and(conditions, eq(invoices.customerId, vendorId));
    }
    
    const outstanding = await db.select().from(invoices).where(conditions).all();
    return outstanding;
  }
}
