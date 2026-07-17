import { describe, it, expect, beforeEach } from 'vitest';
import { VendorAgingQueryService } from './VendorAgingQueryService';
import { VendorInvoiceRepository } from '../infrastructure/VendorInvoiceRepository';
import { VendorInvoiceFactory } from '../domain/VendorInvoiceFactory';

describe('VendorAgingQueryService', () => {
  let queryService: VendorAgingQueryService;
  let repo: VendorInvoiceRepository;
  let factory: VendorInvoiceFactory;

  beforeEach(() => {
    repo = new VendorInvoiceRepository();
    factory = new VendorInvoiceFactory();
    queryService = new VendorAgingQueryService(repo);
  });

  it('should generate aging report correctly', async () => {
    const today = new Date('2023-10-01T00:00:00Z');
    
    // 10 days overdue -> 0_30
    const inv1 = factory.createInvoice('V1', 'INV-1', new Date('2023-09-01'), new Date('2023-09-20'), 'USD');
    inv1.addLine(factory.createLine(inv1.id, 'L1', 1, 1000, 0, 'ACC1'));
    inv1.approve();
    inv1.post();
    
    // 45 days overdue -> 31_60
    const inv2 = factory.createInvoice('V1', 'INV-2', new Date('2023-08-01'), new Date('2023-08-15'), 'USD');
    inv2.addLine(factory.createLine(inv2.id, 'L1', 1, 500, 0, 'ACC1'));
    inv2.approve();
    inv2.post();

    // 100 days overdue -> 91_180
    const inv3 = factory.createInvoice('V2', 'INV-3', new Date('2023-06-01'), new Date('2023-06-15'), 'USD');
    inv3.addLine(factory.createLine(inv3.id, 'L1', 1, 2000, 0, 'ACC1'));
    inv3.approve();
    inv3.post();
    
    // Partially paid 200 days overdue -> OVER_180
    const inv4 = factory.createInvoice('V3', 'INV-4', new Date('2023-02-01'), new Date('2023-02-15'), 'USD');
    inv4.addLine(factory.createLine(inv4.id, 'L1', 1, 3000, 0, 'ACC1'));
    inv4.approve();
    inv4.post();
    inv4.recordPayment(1000); // 2000 remaining

    await repo.save(inv1);
    await repo.save(inv2);
    await repo.save(inv3);
    await repo.save(inv4);

    const report = await queryService.getVendorAgingReport({
      asOfDate: today,
      currencyId: 'USD'
    });

    expect(report.totalOutstanding).toBe(5500); // 1000 + 500 + 2000 + 2000
    expect(report.buckets['0_30']).toBe(1000);
    expect(report.buckets['31_60']).toBe(500);
    expect(report.buckets['91_180']).toBe(2000);
    expect(report.buckets['OVER_180']).toBe(2000);
    
    expect(report.vendors.length).toBe(3);
    
    const v1 = report.vendors.find(v => v.vendorId === 'V1');
    expect(v1?.totalOutstanding).toBe(1500);
    expect(v1?.buckets['0_30']).toBe(1000);
    expect(v1?.buckets['31_60']).toBe(500);
  });
  
  it('should filter by vendorId correctly', async () => {
    const today = new Date('2023-10-01T00:00:00Z');
    
    const inv1 = factory.createInvoice('V1', 'INV-1', new Date('2023-09-01'), new Date('2023-09-20'), 'USD');
    inv1.addLine(factory.createLine(inv1.id, 'L1', 1, 1000, 0, 'ACC1'));
    inv1.approve();
    inv1.post();
    
    const inv3 = factory.createInvoice('V2', 'INV-3', new Date('2023-06-01'), new Date('2023-06-15'), 'USD');
    inv3.addLine(factory.createLine(inv3.id, 'L1', 1, 2000, 0, 'ACC1'));
    inv3.approve();
    inv3.post();
    
    await repo.save(inv1);
    await repo.save(inv3);

    const report = await queryService.getVendorAgingReport({
      asOfDate: today,
      currencyId: 'USD',
      vendorId: 'V2'
    });

    expect(report.totalOutstanding).toBe(2000);
    expect(report.vendors.length).toBe(1);
    expect(report.vendors[0].vendorId).toBe('V2');
  });
});
