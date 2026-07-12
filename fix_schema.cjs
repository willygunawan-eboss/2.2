const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf8');

// The original file is probably messed up. Let's fix it by regex or just replacing the wrong parts.
// Actually, let's just find the `sections` table and fix it.
content = content.replace("sectionId: text('section_id').notNull().references(() => sections.id),\n", "");

// Now add it to positions
content = content.replace(
  "departmentId: text('department_id').notNull().references(() => departments.id),\n  jobGradeId",
  "departmentId: text('department_id').notNull().references(() => departments.id),\n  sectionId: text('section_id').references(() => sections.id),\n  jobGradeId"
);

fs.writeFileSync('src/db/schema.ts', content);
