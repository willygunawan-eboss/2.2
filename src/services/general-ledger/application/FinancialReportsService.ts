import { GeneralLedgerRepository } from '../infrastructure/GeneralLedgerRepository';
import { Logger } from '../../../platform/telemetry/Logger';
import { Tracer } from '../../../platform/telemetry/Tracer';
import { Metrics } from '../../../platform/telemetry/Metrics';

export class FinancialReportsService {
  constructor(private repository: GeneralLedgerRepository) {}

  async generateTrialBalance(startDate: string, endDate: string) {
    const traceId = Tracer.generateTraceId();
    const stopTimer = Metrics.startTimer('generate_trial_balance');
    Logger.info(`Generating Trial Balance for ${startDate} to ${endDate}`, { traceId });

    try {
      const tb = await this.repository.getTrialBalance(startDate, endDate);
      
      const totalDebit = tb.reduce((sum, row) => sum + row.totalDebit, 0);
      const totalCredit = tb.reduce((sum, row) => sum + row.totalCredit, 0);
      
      Logger.info(`Trial Balance generated. Total Debit: ${totalDebit}, Total Credit: ${totalCredit}`, { traceId });
      stopTimer();
      return {
        traceId,
        startDate,
        endDate,
        lines: tb,
        totals: { totalDebit, totalCredit }
      };
    } catch (e) {
      Logger.error(`Failed to generate Trial Balance`, e, { traceId });
      stopTimer();
      throw e;
    }
  }

  async generateFinancialStatements(startDate: string, endDate: string) {
    const tb = await this.generateTrialBalance(startDate, endDate);
    const lines = tb.lines;

    // Foundation for Profit & Loss
    const plLines = lines.filter(l => ['REVENUE', 'EXPENSE'].includes(l.accountType as string));
    const totalRevenue = plLines.filter(l => l.accountType === 'REVENUE').reduce((sum, l) => sum + l.totalCredit - l.totalDebit, 0);
    const totalExpense = plLines.filter(l => l.accountType === 'EXPENSE').reduce((sum, l) => sum + l.totalDebit - l.totalCredit, 0);
    const netIncome = totalRevenue - totalExpense;

    // Foundation for Balance Sheet
    const bsLines = lines.filter(l => ['ASSET', 'LIABILITY', 'EQUITY'].includes(l.accountType as string));
    const totalAssets = bsLines.filter(l => l.accountType === 'ASSET').reduce((sum, l) => sum + l.totalDebit - l.totalCredit, 0);
    const totalLiabilities = bsLines.filter(l => l.accountType === 'LIABILITY').reduce((sum, l) => sum + l.totalCredit - l.totalDebit, 0);
    const totalEquity = bsLines.filter(l => l.accountType === 'EQUITY').reduce((sum, l) => sum + l.totalCredit - l.totalDebit, 0);

    return {
      traceId: tb.traceId,
      profitAndLoss: {
        totalRevenue,
        totalExpense,
        netIncome,
        details: plLines
      },
      balanceSheet: {
        totalAssets,
        totalLiabilities,
        totalEquity,
        details: bsLines
      }
    };
  }
}
