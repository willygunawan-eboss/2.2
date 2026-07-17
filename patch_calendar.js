const fs = require('fs');
const content = fs.readFileSync('src/services/master-data/domain/FiscalCalendar.ts', 'utf8');
if (!content.includes('reopenPeriod')) {
  const newContent = content.replace(
    '}',
    `
  public reopenPeriod(periodNumber: number): void {
    const period = this.props.periods.find(p => p.periodNumber === periodNumber);
    if (!period) throw new MasterDataDomainError(\`Period \${periodNumber} not found\`);
    period.isClosed = false;
  }
}`
  );
  fs.writeFileSync('src/services/master-data/domain/FiscalCalendar.ts', newContent);
}
