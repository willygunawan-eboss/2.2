import { ICustomerInvoiceRepository } from '../domain/ICustomerInvoiceRepository';
import { InvoiceStatus } from '../domain/CustomerInvoice';

export interface CustomerAgingBucket {
  '0_30': number;
  '31_60': number;
  '61_90': number;
  '91_180': number;
  'OVER_180': number;
}

export interface CustomerAgingDTO {
  customerId: string;
  currencyId: string;
  totalOutstanding: number;
  buckets: CustomerAgingBucket;
}

export interface CustomerAgingReport {
  asOfDate: Date;
  currencyId: string;
  companyId?: string;
  totalOutstanding: number;
  buckets: CustomerAgingBucket;
  customers: CustomerAgingDTO[];
}

export interface CustomerAgingFilter {
  currencyId: string;
  asOfDate: Date;
  companyId?: string;
  customerId?: string;
  fiscalPeriod?: string;
}

export class CustomerAgingQueryService {
  constructor(private invoiceRepo: ICustomerInvoiceRepository) {}

  public async getCustomerAgingReport(filter: CustomerAgingFilter): Promise<CustomerAgingReport> {
    const allInvoices = await this.invoiceRepo.getAll();
    
    // Filter out voided or draft invoices, we only care about POSTED or PARTIALLY_PAID 
    // where they actually represent an active asset
    const validStatuses = [InvoiceStatus.POSTED, InvoiceStatus.PARTIALLY_PAID];
    
    let invoices = allInvoices.filter(inv => 
      validStatuses.includes(inv.status) &&
      inv.currencyId === filter.currencyId &&
      // Only include invoices created on or before asOfDate
      inv.invoiceDate.getTime() <= filter.asOfDate.getTime()
    );

    if (filter.customerId) {
      invoices = invoices.filter(inv => inv.customerId === filter.customerId);
    }
    
    // Process aging per customer
    const customerMap = new Map<string, CustomerAgingDTO>();

    for (const inv of invoices) {
      const outstanding = inv.getOutstandingBalance();
      if (outstanding <= 0) continue; // Skip fully paid/credited

      // Calculate days overdue based on due date
      const timeDiff = filter.asOfDate.getTime() - inv.dueDate.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
      
      let dto = customerMap.get(inv.customerId);
      if (!dto) {
        dto = {
          customerId: inv.customerId,
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
        customerMap.set(inv.customerId, dto);
      }

      dto.totalOutstanding += outstanding;

      // Assign to bucket
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

    const report: CustomerAgingReport = {
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
      customers: Array.from(customerMap.values())
    };

    for (const customer of report.customers) {
      report.totalOutstanding += customer.totalOutstanding;
      report.buckets['0_30'] += customer.buckets['0_30'];
      report.buckets['31_60'] += customer.buckets['31_60'];
      report.buckets['61_90'] += customer.buckets['61_90'];
      report.buckets['91_180'] += customer.buckets['91_180'];
      report.buckets['OVER_180'] += customer.buckets['OVER_180'];
    }

    return report;
  }
}
