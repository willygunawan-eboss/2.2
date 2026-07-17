# AR-003 Customer Aging Report

## Architecture Review
The Customer Aging capability provides visibility into outstanding Accounts Receivable based on invoice due dates. It is implemented purely as a Query Service, adhering strictly to the constraint of not creating persistent tables or aggregates for derived data.

## Implementation Details
- **CustomerAgingQueryService**: 
  - Iterates through all \`POSTED\` and \`PARTIALLY_PAID\` invoices.
  - Groups the outstanding balances by Customer ID.
  - Uses the invoice \`dueDate\` against the requested \`asOfDate\` to calculate how many days overdue a balance is.
  - Categorizes the balances into standard buckets (0-30 days, 31-60 days, 61-90 days, 91-180 days, >180 days).
  - Skips fully paid or voided invoices.
- **DTOs**: 
  - \`CustomerAgingDTO\` encapsulates individual customer's buckets and total outstanding balance.
  - \`CustomerAgingReport\` encapsulates the roll-up of all customers, showing total outstanding for a given currency and as-of date.

## Definition of Done
- ✅ Outstanding piutang (Accounts Receivable) dikelompokkan.
- ✅ Bucketing rules applied: 0-30, 31-60, 61-90, 91-180, and >180 hari.
- ✅ Supports filtering by Customer, Currency, Company, and as-of date/Fiscal Period.
- ✅ No new Domain aggregates or platform extensions were created.
- ✅ Followed the exact structural pattern of \`VendorAgingQueryService\`.
- ✅ All unit and integration tests successfully validate the bucketing and aggregation logic.
