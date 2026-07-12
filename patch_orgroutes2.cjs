const fs = require('fs');
let content = fs.readFileSync('src/routes/orgRoutes.ts', 'utf8');

content = content.replace(
  /import \{\s*companySchema, branchSchema, divisionSchema,\s*departmentSchema, jobGradeSchema, positionSchema,\s*orgEmployeeSchema\s*\} from "\.\.\/validations\.js";/,
  `import {
  companySchema, branchSchema, divisionSchema,
  departmentSchema, sectionSchema, teamSchema, 
  jobGradeSchema, positionSchema,
  orgEmployeeSchema
} from "../validations.js";`
);

content = content.replace(
  /buildCrud\("sections", schema\.sections, z\.object\(\{[\s\S]*?\}\), \[schema\.sections\.code, schema\.sections\.name\]\);/,
  `buildCrud("sections", schema.sections, sectionSchema, [schema.sections.code, schema.sections.name]);\nbuildCrud("teams", schema.teams, teamSchema, [schema.teams.code, schema.teams.name]);`
);

content = content.replace(
  /const sections = await db\.select\(\{ id: schema\.sections\.id, name: schema\.sections\.name, departmentId: schema\.sections\.departmentId \}\)\.from\(schema\.sections\)\.where\(notDeleted\(schema\.sections\)\);/,
  `const sections = await db.select({ id: schema.sections.id, name: schema.sections.name, departmentId: schema.sections.departmentId }).from(schema.sections).where(notDeleted(schema.sections));
    const teams = await db.select({ id: schema.teams.id, name: schema.teams.name, sectionId: schema.teams.sectionId }).from(schema.teams).where(notDeleted(schema.teams));`
);

content = content.replace(
  /sections,/,
  `sections,\n        teams,`
);

fs.writeFileSync('src/routes/orgRoutes.ts', content);
