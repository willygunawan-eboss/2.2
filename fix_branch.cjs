const fs = require('fs');
let content = fs.readFileSync('src/services/BranchService.ts', 'utf-8');

// version is not on schema.branches
content = content.replace('version: schema.branches.version,', '');
content = content.replace(/version: number;\n    },/g, '},');
content = content.replace(/if \(existing\.version !== data\.version\) {[^}]+}/g, '');
content = content.replace(/version: existing\.version \+ 1,/g, '');

// getAudits is missing
const getAuditsCode = `
  static async getAudits(branchId: string) {
    return db
      .select()
      .from(schema.branchAudits)
      .where(eq(schema.branchAudits.branchId, branchId))
      .orderBy(desc(schema.branchAudits.createdAt));
  }
`;
content = content.replace(/static async delete/g, getAuditsCode + '\n  static async delete');

fs.writeFileSync('src/services/BranchService.ts', content);
