const fs = require('fs');
let content = fs.readFileSync('src/services/organization/repository/OrganizationRepositoryImpl.ts', 'utf8');

const findRootMethod = `
  async findRoot(): Promise<Organization | null> {
    const record = await db.select().from(schema.orgPlatform).where(
      and(
        isNull(schema.orgPlatform.parentId),
        eq(schema.orgPlatform.isDeleted, false)
      )
    ).get();
    if (!record) return null;
    return this.mapToDomain(record);
  }
`;

content = content.replace('async save', findRootMethod + '\n  async save');
fs.writeFileSync('src/services/organization/repository/OrganizationRepositoryImpl.ts', content);
