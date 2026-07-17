# Accounts Payable Architecture Report

## Architecture Review
The Accounts Payable module has been effectively implemented. It integrates closely with the underlying `Accounting Platform` and `General Ledger` using event-driven architectures and the Process Coordinator pattern.

## Vendor Invoice Aggregate
- **VendorInvoice**: The primary Business Document reflecting a liability to a Vendor.
- **VendorInvoiceLine**: Line-level breakdown of the liability, categorized by account and cost center.
- **VendorInvoiceFactory**: Responsible for orchestrating standard creation.
- **VendorInvoiceError**: Isolated business exceptions complying with the Engineering Guidelines.

## Coordinator Integration
- **RecordVendorInvoiceCoordinator**: Maps the Request to the creation of the `VendorInvoice`.
- Extracts financial data and orchestrates the transition into an `AccountingEvent` (\`VENDOR_INVOICE_RECORDED\`).
- Forwards the event to the `Accounting Platform` via `AccountingApplicationService`.
- Ensures zero direct dependencies on `General Ledger` logic from the `Accounts Payable` use case.

## Definition of Done
- ✅ Bounded Context `accounts-payable` created.
- ✅ Vendor Invoice Aggregate implemented.
- ✅ `RecordVendorInvoiceCoordinator` orchestrates Document -> Event.
- ✅ `AccountingApplicationService` updated to handle `VENDOR_INVOICE_RECORDED`.
- ✅ No direct DB or Ledger modifications done bypassing platform boundaries.
