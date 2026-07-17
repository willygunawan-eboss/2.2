# AR-001 Record Customer Invoice Report

## Architecture Review
The Accounts Receivable (AR) capability has been established with the `Record Customer Invoice` use case. The structure adheres strictly to the existing domain architecture, maintaining parity with the Accounts Payable (AP) logic.

## Domain Components
- **CustomerInvoice**: The core Aggregate reflecting a claim against a customer. Tracks `outstandingBalance`, `paidAmount`, and `creditedAmount`.
- **CustomerInvoiceFactory**: Ensures standardized instantiation of invoices and invoice lines.
- **CustomerInvoiceError**: Domain-specific error class for validation and invariant checking.

## Coordination & Integration
- **RecordCustomerInvoiceCoordinator**: Implements `IProcessCoordinator` to encapsulate the transactional behavior. This coordinator:
  1. Calls `CustomerInvoiceApplicationService` to persist and approve the invoice.
  2. Constructs an `AccountingEvent` (\`CUSTOMER_INVOICE_RECORDED\`) formatted exactly for the Accounting Platform.
  3. Dispatches the event to `AccountingApplicationService`.
  4. Marks the `CustomerInvoice` as `POSTED` upon success.
- **AccountingApplicationService**: Modified to capture the \`CUSTOMER_INVOICE_RECORDED\` event, building a Sales Journal (\`SJ\`) entry that Debits the Asset account (Accounts Receivable) and Credits the Revenue accounts based on the invoice lines.

## Definition of Done
- ✅ CustomerInvoice Aggregate created successfully.
- ✅ CustomerInvoice generates an \`AccountingEvent\`.
- ✅ Accounting Platform correctly interprets the event to form a Sales Journal.
- ✅ General Ledger posts the generated Journal Entry.
- ✅ Workflow concepts adhered to (Coordinator transaction scope).
- ✅ Tests demonstrate total consistency between AR and GL layers.
- ✅ Error boundaries explicitly defined and utilized.
