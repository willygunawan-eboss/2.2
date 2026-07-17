# Vendor Credit Note Architecture Report

## Architecture Review
The Vendor Credit Note business capability (AP-003) has been successfully implemented within the Accounts Payable domain. It extends the AP suite to cover supplier credit memos (return outwards/discounts) and ensures they reflect back to the `Accounting Platform`.

## Vendor Credit Note Aggregate
- **VendorCreditNote**: The primary Business Document reflecting a credit towards a liability.
- **VendorCreditNoteFactory**: Responsible for creating standard, valid credit notes.
- **VendorCreditNoteError**: Isolated business exceptions complying with the Engineering Guidelines.

## Coordinator Integration
- **RecordVendorCreditNoteCoordinator**: Coordinates the creation of a `VendorCreditNote` and the triggering of an `AccountingEvent` (\`VENDOR_CREDIT_NOTE_RECORDED\`).
- Forwards the event to the `Accounting Platform` via `AccountingApplicationService`.
- Prevents direct side effects to `General Ledger` from the AP context.

## Definition of Done
- ✅ Vendor Credit Note Aggregate implemented.
- ✅ Invoice status correctly manages credit balances (reduces outstanding, toggles PAID/PARTIALLY_PAID).
- ✅ `RecordVendorCreditNoteCoordinator` orchestrates Document -> Event correctly.
- ✅ `AccountingApplicationService` updated to handle `VENDOR_CREDIT_NOTE_RECORDED` producing General Journals (GJ).
- ✅ Unit tests executing successfully covering partial credit and over-crediting rejection.
- ✅ All rules implemented within a strict single transaction coordinator.
