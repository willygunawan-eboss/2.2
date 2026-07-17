const fs = require('fs');
let content = fs.readFileSync('src/services/organization/application/OrganizationApplicationService.ts', 'utf8');

const updatedImports = `import { OrganizationNotFoundError, InvalidOrganizationCodeError, InvalidOrganizationParentError, MultipleRootOrganizationError } from "../domain/OrganizationErrors.js";`;

content = content.replace(/import { OrganizationNotFoundError, .* } from "\.\.\/domain\/OrganizationErrors\.js";/, updatedImports);

const originalHierarchyCheck = `
    if (dto.parentId) {
      const parent = await this.repository.findById(dto.parentId);
      if (!parent) {
        throw new OrganizationNotFoundError(dto.parentId);
      }
      org.setHierarchy(parent);
    } else {
      org.setHierarchy(null);
    }
`;

const updatedHierarchyCheck = `
    if (dto.parentId) {
      const parent = await this.repository.findById(dto.parentId);
      if (!parent) {
        throw new OrganizationNotFoundError(dto.parentId);
      }
      org.setHierarchy(parent);
    } else {
      const existingRoot = await this.repository.findRoot();
      if (existingRoot) {
        throw new MultipleRootOrganizationError();
      }
      org.setHierarchy(null);
    }
`;

content = content.replace(originalHierarchyCheck, updatedHierarchyCheck);
fs.writeFileSync('src/services/organization/application/OrganizationApplicationService.ts', content);
