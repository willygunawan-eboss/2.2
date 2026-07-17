import { Router } from 'express';
import { AccountsPayableRepository } from '../services/accounts-payable/infrastructure/AccountsPayableRepository';
import { VendorCreditNoteFactory } from '../services/accounts-payable/domain/VendorCreditNoteFactory';
import { VendorPaymentFactory } from '../services/accounts-payable/domain/VendorPaymentFactory';
import { ApplyVendorCreditMemoUseCase } from '../services/accounts-payable/application/ApplyVendorCreditMemoUseCase';
import { ReconcileAPPaymentUseCase } from '../services/accounts-payable/application/ReconcileAPPaymentUseCase';
import { APQueries } from '../services/accounts-payable/application/APQueries';

import { AccountsReceivableRepository } from '../services/accounts-receivable/infrastructure/AccountsReceivableRepository';
import { CustomerCreditNoteFactory } from '../services/accounts-receivable/domain/CustomerCreditNoteFactory';
import { CustomerReceiptFactory } from '../services/accounts-receivable/domain/CustomerReceiptFactory';
import { ApplyCustomerCreditMemoUseCase } from '../services/accounts-receivable/application/ApplyCustomerCreditMemoUseCase';
import { ReconcileARReceiptUseCase } from '../services/accounts-receivable/application/ReconcileARReceiptUseCase';
import { ARQueries } from '../services/accounts-receivable/application/ARQueries';

import { GeneralLedgerRepository } from '../services/general-ledger/infrastructure/GeneralLedgerRepository';
import { FinancialReportsService } from '../services/general-ledger/application/FinancialReportsService';
import { YearClosingService } from '../services/general-ledger/application/YearClosingService';

import { IdempotencyStore } from '../platform/telemetry/IdempotencyStore';

const router = Router();
const idempotencyStore = new IdempotencyStore();

// AP Routes
const apRepo = new AccountsPayableRepository();
const applyVendorCreditMemo = new ApplyVendorCreditMemoUseCase(apRepo, new VendorCreditNoteFactory());
const reconcileAPPayment = new ReconcileAPPaymentUseCase(apRepo, new VendorPaymentFactory());

router.post('/ap/credit-memo', async (req, res) => {
  try {
    const idempotencyKey = req.headers['x-idempotency-key'] as string;
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      return res.json(idempotencyStore.get(idempotencyKey));
    }
    const traceId = await applyVendorCreditMemo.execute(req.body);
    const result = { success: true, traceId };
    if (idempotencyKey) idempotencyStore.set(idempotencyKey, result);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/ap/outstanding', async (req, res) => {
  try {
    const data = await APQueries.getOutstandingInvoices(req.query.vendorId as string);
    res.json({ data });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/ap/reconcile-payment', async (req, res) => {
  try {
    const idempotencyKey = req.headers['x-idempotency-key'] as string;
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      return res.json(idempotencyStore.get(idempotencyKey));
    }
    const traceId = await reconcileAPPayment.execute(req.body);
    const result = { success: true, traceId };
    if (idempotencyKey) idempotencyStore.set(idempotencyKey, result);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// AR Routes
const arRepo = new AccountsReceivableRepository();
const applyCustomerCreditMemo = new ApplyCustomerCreditMemoUseCase(arRepo, new CustomerCreditNoteFactory());
const reconcileARReceipt = new ReconcileARReceiptUseCase(arRepo, new CustomerReceiptFactory());

router.post('/ar/credit-memo', async (req, res) => {
  try {
    const idempotencyKey = req.headers['x-idempotency-key'] as string;
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      return res.json(idempotencyStore.get(idempotencyKey));
    }
    const traceId = await applyCustomerCreditMemo.execute(req.body);
    const result = { success: true, traceId };
    if (idempotencyKey) idempotencyStore.set(idempotencyKey, result);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/ar/outstanding', async (req, res) => {
  try {
    const data = await ARQueries.getOutstandingInvoices(req.query.customerId as string);
    res.json({ data });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/ar/reconcile-receipt', async (req, res) => {
  try {
    const idempotencyKey = req.headers['x-idempotency-key'] as string;
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      return res.json(idempotencyStore.get(idempotencyKey));
    }
    const traceId = await reconcileARReceipt.execute(req.body);
    const result = { success: true, traceId };
    if (idempotencyKey) idempotencyStore.set(idempotencyKey, result);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// GL Routes
const glRepo = new GeneralLedgerRepository();
const financialReports = new FinancialReportsService(glRepo);
const yearClosing = new YearClosingService(glRepo);

router.get('/gl/trial-balance', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await financialReports.generateTrialBalance(startDate as string, endDate as string);
    res.json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.get('/gl/financial-statement', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await financialReports.generateFinancialStatements(startDate as string, endDate as string);
    res.json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/gl/year-close', async (req, res) => {
  try {
    const idempotencyKey = req.headers['x-idempotency-key'] as string;
    if (idempotencyKey && idempotencyStore.has(idempotencyKey)) {
      return res.json(idempotencyStore.get(idempotencyKey));
    }
    const data = await yearClosing.closeYear(Number(req.body.year));
    if (idempotencyKey) idempotencyStore.set(idempotencyKey, data);
    res.json(data);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export { router as financialRoutes };
