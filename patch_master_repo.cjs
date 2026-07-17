const fs = require('fs');

let iface = fs.readFileSync('src/services/master-data/domain/IMasterDataRepository.ts', 'utf8');
if (!iface.includes('getFiscalCalendar')) {
  iface = iface.replace(
    /}$/,
    `  getFiscalCalendar(id: string): Promise<FiscalCalendar | null>;\n}`
  );
  fs.writeFileSync('src/services/master-data/domain/IMasterDataRepository.ts', iface);
}

let impl = fs.readFileSync('src/services/master-data/infrastructure/MasterDataRepository.ts', 'utf8');
if (!impl.includes('getFiscalCalendar')) {
  impl = impl.replace(
    'private currencies: Map<string, Currency> = new Map();',
    'private currencies: Map<string, Currency> = new Map();\n  private calendars: Map<string, FiscalCalendar> = new Map();'
  );
  impl = impl.replace(
    'async saveFiscalCalendar(calendar: FiscalCalendar): Promise<void> {}',
    `async saveFiscalCalendar(calendar: FiscalCalendar): Promise<void> { this.calendars.set(calendar.id, calendar); }
  async getFiscalCalendar(id: string): Promise<FiscalCalendar | null> { return this.calendars.get(id) || null; }`
  );
  fs.writeFileSync('src/services/master-data/infrastructure/MasterDataRepository.ts', impl);
}
