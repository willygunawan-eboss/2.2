import { db } from '../../../db';
import { invoices, invoiceItems, apCreditNotes, apPayments } from '../../../db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { VendorInvoice, InvoiceStatus } from '../domain/VendorInvoice';
import { VendorInvoiceLine } from '../domain/VendorInvoiceLine';
import { VendorCreditNote, CreditNoteStatus } from '../domain/VendorCreditNote';
import { VendorPayment, PaymentStatus } from '../domain/VendorPayment';

export class AccountsPayableRepository {
  async getInvoiceById(id: string): Promise<VendorInvoice | null> {
    const inv = await db.select().from(invoices).where(eq(invoices.id, id)).get();
    if (!inv) return null;

    const items = await db.select().from(invoiceItems).where(eq(invoiceItems.invoiceId, id)).all();

    const lines = items.map(item => new VendorInvoiceLine({
      id: item.id,
      invoiceId: item.invoiceId,
      description: item.description || '',
      quantity: item.quantity || 1,
      unitPrice: item.price || 0,
      taxAmount: 0, // Simplified for now since invoiceItems schema lacks taxAmount

      accountId: 'SYSTEM_ACCOUNT',
    }));

    return new VendorInvoice({
      id: inv.id,
      vendorId: inv.customerId, // Using customerId field for vendorId in invoices table schema simplification
      invoiceNumber: inv.invoiceNumber,
      invoiceDate: new Date(inv.date),
      dueDate: new Date(inv.dueDate),
      currencyId: 'IDR', // Defaulting for simplified schema
      status: inv.status as InvoiceStatus,
      lines,
      paidAmount: inv.amountPaid,
      creditedAmount: inv.amountDue, // repurpose
      version: 1
    });
  }

  async saveInvoice(invoice: VendorInvoice, tx?: any): Promise<void> {
    const dbClient = tx || db;
    
    
    const dbData = {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.invoiceDate.toISOString(),
      dueDate: invoice.dueDate.toISOString(),
      customerId: invoice.vendorId, // Using customerId as vendorId
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

  async saveCreditNote(note: VendorCreditNote, tx?: any): Promise<void> {
    const dbClient = tx || db;
    const dbData = {
      id: note.id,
      vendorId: note.vendorId,
      invoiceId: note.invoiceId,
      amount: note.amount,
      creditDate: note.creditDate.toISOString(),
      currencyId: note.currencyId,
      referenceNumber: note.referenceNumber,
      status: note.status,
      creditAccountId: note.creditAccountId,
      version: 1
    };
    await dbClient.insert(apCreditNotes).values(dbData)
      .onConflictDoUpdate({ target: apCreditNotes.id, set: dbData });
  }

  async savePayment(payment: VendorPayment, tx?: any): Promise<void> {
    const dbClient = tx || db;
    const dbData = {
      id: payment.id,
      vendorId: payment.vendorId,
      invoiceId: payment.invoiceId,
      amount: payment.amount,
      paymentDate: payment.paymentDate.toISOString(),
      currencyId: payment.currencyId,
      referenceNumber: payment.referenceNumber,
      status: payment.status,
      version: 1
    };
    await dbClient.insert(apPayments).values(dbData)
      .onConflictDoUpdate({ target: apPayments.id, set: dbData });
  }
}
