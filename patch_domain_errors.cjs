const fs = require('fs');
let content = fs.readFileSync('src/services/organization/domain/OrganizationErrors.ts', 'utf8');

const multipleRootError = `
export class MultipleRootOrganizationError extends OrganizationError {
  constructor() {
    super(\`Only one root organization is allowed\`, 'MULTIPLE_ROOT_NOT_ALLOWED');
  }
}
`;

content = content + multipleRootError;
fs.writeFileSync('src/services/organization/domain/OrganizationErrors.ts', content);
