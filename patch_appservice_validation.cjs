const fs = require('fs');
let content = fs.readFileSync('src/services/organization/application/OrganizationApplicationService.ts', 'utf8');

const updatedImports = `import { OrganizationValidator } from "../validation/OrganizationValidator.js";\nimport { OrganizationNotFoundError`;

content = content.replace('import { OrganizationNotFoundError', updatedImports);

const originalCreate = `  async createOrganization(dto: CreateOrganizationDTO, actor: string): Promise<OrganizationResponseDTO> {
    const existing = await this.repository.findByCode(dto.code);`;

const updatedCreate = `  async createOrganization(dto: CreateOrganizationDTO, actor: string): Promise<OrganizationResponseDTO> {
    OrganizationValidator.validateCreate(dto);
    
    const existing = await this.repository.findByCode(dto.code);`;

content = content.replace(originalCreate, updatedCreate);

fs.writeFileSync('src/services/organization/application/OrganizationApplicationService.ts', content);
