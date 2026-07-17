const fs = require('fs');
let content = fs.readFileSync('src/services/organization/OrganizationEngine.ts', 'utf8');

const deprecationNotice = `
/**
 * @deprecated Legacy compatibility.
 * Will be removed after Organization Platform Release 3.2.
 * Please use OrganizationApplicationService instead.
 */
export class OrganizationBusinessEngine {
`;

content = content.replace('export class OrganizationBusinessEngine {', deprecationNotice);
fs.writeFileSync('src/services/organization/OrganizationEngine.ts', content);
console.log("Patched OrganizationEngine.ts");
