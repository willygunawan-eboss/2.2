import { IVendorInvoiceRepository } from '../domain/IVendorInvoiceRepository';
import { InvoiceStatus } from '../domain/VendorInvoice';

export interface VendorAgingBucket {
  '0_30': number;
  '31_60': number;
  '61_90': number;
  '91_180': number;
  'OVER_180': number;
}

export interface VendorAgingDTO {
  vendorId: string;
  currencyId: string;
  totalOutstanding: number;
  buckets: VendorAgingBucket;
}

export interface VendorAgingReport {
  asOfDate: Date;
  currencyId: string;
  companyId?: string;
  totalOutstanding: number;
  buckets: VendorAgingBucket;
  vendors: VendorAgingDTO[];
}

export interface VendorAgingFilter {
  currencyId: string;
  asOfDate: Date;
  companyId?: string;
  vendorId?: string;
  fiscalPeriod?: string;
}

export class VendorAgingQueryService {
  constructor(private invoiceRepo: IVendorInvoiceRepository) {}

  public async getVendorAgingReport(filter: VendorAgingFilter): Promise<VendorAgingReport> {
    const allInvoices = await this.invoiceRepo.getAll();
    
    // Filter out voided or draft invoices, we only care about POSTED or PARTIALLY_PAID 
    // where they actually represent an active liability
    const validStatuses = [InvoiceStatus.POSTED, InvoiceStatus.PARTIALLY_PAID];
    
    let invoices = allInvoices.filter(inv => 
      validStatuses.includes(inv.status) &&
      inv.currencyId === filter.currencyId &&
      // Only include invoices created on or before asOfDate
      inv.invoiceDate.getTime() <= filter.asOfDate.getTime()
    );

    if (filter.vendorId) {
      invoices = invoices.filter(inv => inv.vendorId === filter.vendorId);
    }
    
    // Optional companyId filtering could be done here if invoice had companyId
    // if (filter.companyId) { ... }
    
    // Process aging per vendor
    const vendorMap = new Map<string, VendorAgingDTO>();

    for (const inv of invoices) {
      const outstanding = inv.getOutstandingBalance();
      if (outstanding <= 0) continue; // Skip fully paid/credited

      // Calculate days overdue based on due date
      const timeDiff = filter.asOfDate.getTime() - inv.dueDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      let dto = vendorMap.get(inv.vendorId);
      if (!dto) {
        dto = {
          vendorId: inv.vendorId,
          currencyId: inv.currencyId,
          totalOutstanding: 0,
          buckets: {
            '0_30': 0,
            '31_60': 0,
            '61_90': 0,
            '91_180': 0,
            'OVER_180': 0
          }
        };
        vendorMap.set(inv.vendorId, dto);
      }

      dto.totalOutstanding += outstanding;

      // Assign to bucket (if not due yet, might be negative, we put in 0-30 for now or treat as Current if we had one. 
      // The requirement says 0-30, 31-60... we'll treat <=30 as 0-30)
      if (daysDiff <= 30) {
        dto.buckets['0_30'] += outstanding;
      } else if (daysDiff <= 60) {
        dto.buckets['31_60'] += outstanding;
      } else if (daysDiff <= 90) {
        dto.buckets['61_90'] += outstanding;
      } else if (daysDiff <= 180) {
        dto.buckets['91_180'] += outstanding;
      } else {
        dto.buckets['OVER_180'] += outstanding;
      }
    }

    const report: VendorAgingReport = {
      asOfDate: filter.asOfDate,
      currencyId: filter.currencyId,
      companyId: filter.companyId,
      totalOutstanding: 0,
      buckets: {
        '0_30': 0,
        '31_60': 0,
        '61_90': 0,
        '91_180': 0,
        'OVER_180': 0
      },
      vendors: Array.from(vendorMap.values())
    };

    for (const vendor of report.vendors) {
      report.totalOutstanding += vendor.totalOutstanding;
      report.buckets['0_30'] += vendor.buckets['0_30'];
      report.buckets['31_60'] += vendor.buckets['31_60'];
      report.buckets['61_90'] += vendor.buckets['61_90'];
      report.buckets['91_180'] += vendor.buckets['91_180'];
      report.buckets['OVER_180'] += vendor.buckets['OVER_180'];
    }

    return report;
  }
}
