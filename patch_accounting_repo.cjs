const fs = require('fs');

let iface = fs.readFileSync('src/services/accounting/domain/IAccountingRepository.ts', 'utf8');
if (!iface.includes('getUnpostedEntriesInDateRange')) {
  iface = iface.replace(
    /}$/,
    `  getUnpostedEntriesInDateRange(startDate: Date, endDate: Date): Promise<JournalEntry[]>;\n}`
  );
  fs.writeFileSync('src/services/accounting/domain/IAccountingRepository.ts', iface);
}

let impl = fs.readFileSync('src/services/accounting/infrastructure/AccountingRepository.ts', 'utf8');
if (!impl.includes('getUnpostedEntriesInDateRange')) {
  impl = impl.replace(
    /}$/,
    `  async getUnpostedEntriesInDateRange(startDate: Date, endDate: Date): Promise<JournalEntry[]> {
    const unposted: JournalEntry[] = [];
    for (const entry of this.entries.values()) {
      if (entry.status !== 'POSTED' && entry.entryDate >= startDate && entry.entryDate <= endDate) {
        unposted.push(entry);
      }
    }
    return unposted;
  }
}
`
  );
  fs.writeFileSync('src/services/accounting/infrastructure/AccountingRepository.ts', impl);
}
