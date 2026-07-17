const fs = require('fs');
let content = fs.readFileSync('src/services/organization/repository/IOrganizationRepository.ts', 'utf8');
content = content.replace('exists(id: string): Promise<boolean>;', 'exists(id: string): Promise<boolean>;\n  findRoot(): Promise<Organization | null>;');
fs.writeFileSync('src/services/organization/repository/IOrganizationRepository.ts', content);
