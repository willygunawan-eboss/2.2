import { db } from '../../../db';
import { invoices, invoiceItems, arCreditNotes, arReceipts } from '../../../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { CustomerInvoice, InvoiceStatus } from '../domain/CustomerInvoice';
import { CustomerInvoiceLine } from '../domain/CustomerInvoice';
import { CustomerCreditNote } from '../domain/CustomerCreditNote';
import { CustomerReceipt } from '../domain/CustomerReceipt';

export class AccountsReceivableRepository {
  async getInvoiceById(id: string): Promise<CustomerInvoice | null> {
    const inv = await db.select().from(invoices).where(eq(invoices.id, id)).get();
    if (!inv) return null;

    const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id)).all();

    const lines = items.map(item => ({
      id: item.id,
      description: item.description || '',
      quantity: item.quantity || 1,
      unitPrice: item.price || 0,
      taxAmount: 0, // Simplified

      revenueAccountId: 'SYSTEM_ACCOUNT',
    }));

    return new CustomerInvoice({
      id: inv.id,
      customerId: inv.customerId,
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: new Date(inv.date),
      dueDate: new Date(inv.dueDate),
      currencyId: 'IDR',
      status: inv.status as InvoiceStatus,
      lines,
      paidAmount: inv.amountPaid,
      creditedAmount: inv.amountDue,
      version: 1
    });
  }

  async saveInvoice(invoice: CustomerInvoice, tx?: any): Promise<void> {
    const dbClient = tx || db;
    const dbData = {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.invoiceDate.toISOString(),
      dueDate: invoice.dueDate.toISOString(),
      customerId: invoice.customerId,
      subtotal: invoice.getTotalAmount(),
      total: invoice.getTotalAmount(),
      amountPaid: invoice.paidAmount,
      amountDue: invoice.creditedAmount, 
      status: invoice.status
    };

    // Optimistic locking enforced
    const existingVersion = await dbClient.select({ version: invoices.version }).from(invoices).where(eq(invoices.id, invoice.id)).get();
    
    if (existingVersion) {
      if (invoice.version && invoice.version < existingVersion.version) {
        throw new Error('Optimistic concurrency error: The invoice has been modified by another transaction');
      }
      dbData.version = (existingVersion.version || 0) + 1;
      await dbClient.update(invoices).set(dbData).where(and(eq(invoices.id, invoice.id), eq(invoices.version, existingVersion.version)));
    } else {
      dbData.version = 1;
      await dbClient.insert(invoices).values(dbData);
    }
  }

  async saveCreditNote(note: CustomerCreditNote, tx?: any): Promise<void> {
    const dbClient = tx || db;
    const dbData = {
      id: note.id,
      customerId: note.customerId,
      invoiceId: note.invoiceId,
      amount: note.amount,
      creditDate: note.creditDate.toISOString(),
      currencyId: note.currencyId,
      referenceNumber: note.referenceNumber,
      status: note.status,
      creditAccountId: note.creditAccountId,
      version: 1
    };
    await dbClient.insert(arCreditNotes).values(dbData)
      .onConflictDoUpdate({ target: arCreditNotes.id, set: dbData });
  }

  async saveReceipt(receipt: CustomerReceipt, tx?: any): Promise<void> {
    const dbClient = tx || db;
    const dbData = {
      id: receipt.id,
      customerId: receipt.customerId,
      invoiceId: receipt.invoiceId,
      amount: receipt.amount,
      receiptDate: receipt.receiptDate.toISOString(),
      currencyId: receipt.currencyId,
      referenceNumber: receipt.referenceNumber,
      status: receipt.status,
      version: 1
    };
    await dbClient.insert(arReceipts).values(dbData)
      .onConflictDoUpdate({ target: arReceipts.id, set: dbData });
  }
}
