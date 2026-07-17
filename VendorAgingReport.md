# Vendor Aging Architecture Report

## Architecture Review
The Vendor Aging capability (AP-004) has been implemented correctly in the `Accounts Payable` stream without making structural modifications to the domain. This is a read-model query capability designed to report on the state of `VendorInvoice` entities in relation to an `asOfDate`.

## Implementation Details
- **VendorAgingQueryService**: Iterates over valid `VendorInvoice` entities (POSTED or PARTIALLY_PAID) and calculates the outstanding balance (`invoice amount` - `paid amount` - `credited amount`).
- **Bucketing**: Segregates the outstanding amounts based on the difference between `asOfDate` and the Invoice's `dueDate`. 
- **Categories**: 
  - 0-30 days
  - 31-60 days
  - 61-90 days
  - 91-180 days
  - >180 days

## Definition of Done
- ✅ Vendor Aging calculation completed without adding a separate DB table.
- ✅ Accurately computes outstanding taking payments and credits into consideration.
- ✅ Bucketing rules implemented appropriately.
- ✅ Vendor Aging Query Service filters by `currencyId` and optionally `vendorId`, `companyId`, `fiscalPeriod` (which is functionally similar to `asOfDate`).
- ✅ Unit tests run successfully to prove bucketing correctness over varying dates and invoice statuses.
- ✅ Platform boundary maintained—Aging doesn't write to DB.
