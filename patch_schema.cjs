const fs = require('fs');
let schema = fs.readFileSync('src/db/schema.ts', 'utf8');

if (!schema.includes('journal_entries')) {
  const ap_ar_gl = `
export const journalEntries = sqliteTable("journal_entries", {
  id: text("id").primaryKey(),
  journalId: text("journal_id").notNull(),
  entryNumber: text("entry_number").notNull(),
  entryDate: text("entry_date").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  version: integer("version").notNull().default(1)
});

export const journalLines = sqliteTable("journal_lines", {
  id: text("id").primaryKey(),
  journalEntryId: text("journal_entry_id").notNull().references(() => journalEntries.id),
  accountId: text("account_id").notNull(),
  entryType: text("entry_type").notNull(),
  amount: real("amount").notNull(),
  currencyId: text("currency_id").notNull(),
  description: text("description")
});

export const ledgerAccounts = sqliteTable("ledger_accounts", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  accountType: text("account_type").notNull(),
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  version: integer("version").notNull().default(1)
});

export const ledgerPostings = sqliteTable("ledger_postings", {
  id: text("id").primaryKey(),
  ledgerId: text("ledger_id").notNull(),
  accountId: text("account_id").notNull().references(() => ledgerAccounts.id),
  journalEntryId: text("journal_entry_id").notNull(),
  journalLineId: text("journal_line_id").notNull(),
  entryType: text("entry_type").notNull(),
  amount: real("amount").notNull(),
  currencyId: text("currency_id").notNull(),
  postingDate: text("posting_date").notNull(),
  fiscalPeriodId: text("fiscal_period_id").notNull()
});

export const apCreditNotes = sqliteTable("ap_credit_notes", {
  id: text("id").primaryKey(),
  vendorId: text("vendor_id").notNull().references(() => vendors.id),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  amount: real("amount").notNull(),
  creditDate: text("credit_date").notNull(),
  currencyId: text("currency_id").notNull(),
  referenceNumber: text("reference_number"),
  status: text("status").notNull(),
  creditAccountId: text("credit_account_id").notNull(),
  version: integer("version").notNull().default(1)
});

export const arCreditNotes = sqliteTable("ar_credit_notes", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  amount: real("amount").notNull(),
  creditDate: text("credit_date").notNull(),
  currencyId: text("currency_id").notNull(),
  referenceNumber: text("reference_number"),
  status: text("status").notNull(),
  creditAccountId: text("credit_account_id").notNull(),
  version: integer("version").notNull().default(1)
});

export const apPayments = sqliteTable("ap_payments", {
  id: text("id").primaryKey(),
  vendorId: text("vendor_id").notNull().references(() => vendors.id),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  amount: real("amount").notNull(),
  paymentDate: text("payment_date").notNull(),
  currencyId: text("currency_id").notNull(),
  referenceNumber: text("reference_number"),
  status: text("status").notNull(),
  version: integer("version").notNull().default(1)
});

export const arReceipts = sqliteTable("ar_receipts", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  amount: real("amount").notNull(),
  receiptDate: text("receipt_date").notNull(),
  currencyId: text("currency_id").notNull(),
  referenceNumber: text("reference_number"),
  status: text("status").notNull(),
  version: integer("version").notNull().default(1)
});
`;
  schema = schema + '\n' + ap_ar_gl;
  fs.writeFileSync('src/db/schema.ts', schema);
}
