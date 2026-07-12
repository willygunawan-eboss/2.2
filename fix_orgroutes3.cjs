const fs = require('fs');
let content = fs.readFileSync('src/routes/orgRoutes.ts', 'utf8');

content = content.replace(
  /buildCrud\("sections", schema\.sections,[\s\S]*?teams, sectionSchema, \[schema\.sections\.code, schema\.sections\.name\]\);/,
  `buildCrud("sections", schema.sections, sectionSchema, [schema.sections.code, schema.sections.name]);`
);

fs.writeFileSync('src/routes/orgRoutes.ts', content);
