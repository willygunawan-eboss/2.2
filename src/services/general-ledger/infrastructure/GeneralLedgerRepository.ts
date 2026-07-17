import { db } from '../../../db';
import { ledgerAccounts, ledgerPostings } from '../../../db/schema';
import { eq, and, sql, between } from 'drizzle-orm';
import { LedgerAccount } from '../domain/LedgerAccount';
import { LedgerPosting } from '../domain/LedgerPosting';

export class GeneralLedgerRepository {
  async getTrialBalance(startDate: string, endDate: string) {
    // A simplified query to get the net balance per account
    const query = sql`
      SELECT 
        a.id as accountId, 
        a.code as accountCode, 
        a.name as accountName, 
        a.account_type as accountType,
        SUM(CASE WHEN p.entry_type = 'DEBIT' THEN p.amount ELSE 0 END) as totalDebit,
        SUM(CASE WHEN p.entry_type = 'CREDIT' THEN p.amount ELSE 0 END) as totalCredit
      FROM ${ledgerAccounts} a
      LEFT JOIN ${ledgerPostings} p ON a.id = p.account_id 
        AND p.posting_date >= ${startDate} AND p.posting_date <= ${endDate}
      GROUP BY a.id, a.code, a.name, a.account_type
    `;
    const results = (await db.all(query)) as any[];
    return results.map(row => ({
      accountId: row.accountId,
      accountCode: row.accountCode,
      accountName: row.accountName,
      accountType: row.accountType,
      totalDebit: row.totalDebit || 0,
      totalCredit: row.totalCredit || 0,
      netBalance: (row.totalDebit || 0) - (row.totalCredit || 0)
    }));
  }
}
