const fs = require('fs');
let content = fs.readFileSync('src/db/seeder.ts', 'utf8');

const replacement = `const comp = await db.select().from(schema.companies).limit(1);
  if (comp.length > 0) {
    const branch = await db.select().from(schema.branches).limit(1);
    let defaultBranchId = branch[0]?.id;
    if (!defaultBranchId) {
      defaultBranchId = randomUUID();
      await db.insert(schema.branches).values({
        id: defaultBranchId,
        companyId: comp[0].id,
        code: 'BR-01',
        name: 'Main Branch'
      });
    }

    const div = await db.select().from(schema.divisions).limit(1);
    let defaultDivId = div[0]?.id;
    if (!defaultDivId) {
      defaultDivId = randomUUID();
      await db.insert(schema.divisions).values({
        id: defaultDivId,
        companyId: comp[0].id,
        branchId: defaultBranchId,
        code: 'DIV-01',
        name: 'Main Division'
      });
    }`;

content = content.replace(
  /const comp = await db\.select\(\)\.from\(schema\.companies\)\.limit\(1\);\n  if \(comp\.length > 0\) \{\n    const div = await db\.select\(\)\.from\(schema\.divisions\)\.limit\(1\);\n    let defaultDivId = div\[0\]\?\.id;\n    if \(!defaultDivId\) \{\n      defaultDivId = randomUUID\(\);\n      await db\.insert\(schema\.divisions\)\.values\(\{\n        id: defaultDivId,\n        companyId: comp\[0\]\.id,\n        code: 'DIV-01',\n        name: 'Main Division'\n      \}\);\n    \}/,
  replacement
);

fs.writeFileSync('src/db/seeder.ts', content);
