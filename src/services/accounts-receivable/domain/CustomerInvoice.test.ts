import { describe, it, expect } from 'vitest';
import { CustomerInvoiceFactory } from './CustomerInvoiceFactory';
import { InvoiceStatus } from './CustomerInvoice';

describe('CustomerInvoice Aggregate', () => {
  it('should calculate total and outstanding correctly', () => {
    const factory = new CustomerInvoiceFactory();
    const invoice = factory.createInvoice('CUST-1', 'INV-001', new Date(), new Date(), 'IDR');
    
    invoice.addLine(factory.createLine('Item 1', 2, 1000, 200, 'REV-1')); // 2200
    invoice.addLine(factory.createLine('Item 2', 1, 500, 50, 'REV-1')); // 550
    
    expect(invoice.getTotalAmount()).toBe(2750);
    expect(invoice.getOutstandingBalance()).toBe(2750);
  });

  it('should transition states correctly', () => {
    const factory = new CustomerInvoiceFactory();
    const invoice = factory.createInvoice('CUST-1', 'INV-001', new Date(), new Date(), 'IDR');
    
    invoice.addLine(factory.createLine('Item 1', 1, 1000, 0, 'REV-1'));
    
    expect(invoice.status).toBe(InvoiceStatus.DRAFT);
    
    invoice.approve();
    expect(invoice.status).toBe(InvoiceStatus.APPROVED);
    
    invoice.post();
    expect(invoice.status).toBe(InvoiceStatus.POSTED);
  });
});
