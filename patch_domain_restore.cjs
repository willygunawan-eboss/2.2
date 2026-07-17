const fs = require('fs');
let content = fs.readFileSync('src/services/organization/domain/Organization.ts', 'utf8');
const restoreMethod = `
  public restore() {
    this.props.status = OrganizationStatus.create(true, false);
  }
`;
content = content.replace('public markAsDeleted() {', restoreMethod + '\n  public markAsDeleted() {');
fs.writeFileSync('src/services/organization/domain/Organization.ts', content);
console.log("Patched domain restore");
