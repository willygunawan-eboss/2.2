# AR-002 Record Customer Receipt Report

## Architecture Review
The Accounts Receivable (AR) capability has been expanded to support the `Record Customer Receipt` use case. This handles incoming payments from customers and manages the reduction of accounts receivable balances.

## Domain Components
- **CustomerReceipt**: The aggregate representing a payment received from a customer.
- **CustomerReceiptFactory**: Standardizes the creation of receipts.
- **CustomerReceiptError**: Specifically tracks AR receipt domain errors.
- **CustomerInvoice Modification**: Enhanced to support `recordReceipt` behavior which accurately tracks payments toward the invoice and automatically transitions statuses (e.g. from `POSTED` -> `PARTIALLY_PAID` -> `PAID`).

## Coordination & Integration
- **RecordCustomerReceiptCoordinator**: Adheres to `IProcessCoordinator` to ensure cross-module transactional consistency.
  1. Utilizes `CustomerReceiptApplicationService` to validate and store the receipt.
  2. Modifies the corresponding `CustomerInvoice` outstanding balance.
  3. Formulates a \`CUSTOMER_RECEIPT_RECORDED\` `AccountingEvent`.
  4. Triggers the `AccountingPlatform` via `AccountingApplicationService` to process the event.
  5. Updates the receipt status to `POSTED` on success.
- **AccountingApplicationService**: Captures \`CUSTOMER_RECEIPT_RECORDED\`, mapped directly to a Cash Receipts Journal (\`CRJ\`). This entry Debits the Cash asset account and Credits the Accounts Receivable asset account.

## Definition of Done
- ✅ Only outstanding invoices can receive payments (exceeding payments are blocked by aggregate rules).
- ✅ Partial and full receipts are both natively supported.
- ✅ Invoice outstanding amounts and statuses are automatically updated.
- ✅ Receipt correctly generates an \`AccountingEvent\`.
- ✅ Accounting Platform correctly interprets the event to form a Cash Receipts Journal.
- ✅ General Ledger posts the generated Journal Entry exactly once.
- ✅ All validations and cross-aggregate behaviors occur within a single transaction coordinator.
- ✅ Unit tests run successfully proving balance management and GL debit/credit entries.
