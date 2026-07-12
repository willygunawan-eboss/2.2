const fs = require('fs');
let content = fs.readFileSync('src/routes/orgRoutes.ts', 'utf8');

// add section schema to validations.ts or create one inline. Let's look for departmentSchema.
content = content.replace(
  "buildCrud(\"departments\", schema.departments, departmentSchema, [schema.departments.code, schema.departments.name]);",
  "buildCrud(\"departments\", schema.departments, departmentSchema, [schema.departments.code, schema.departments.name]);\nbuildCrud(\"sections\", schema.sections, z.object({\n  departmentId: z.string().min(1),\n  code: z.string().min(1),\n  name: z.string().min(1),\n  isActive: z.boolean().optional().default(true)\n}), [schema.sections.code, schema.sections.name]);"
);

content = content.replace(
  "const departments = await db.select({ id: schema.departments.id, name: schema.departments.name, divisionId: schema.departments.divisionId }).from(schema.departments).where(notDeleted(schema.departments));",
  "const departments = await db.select({ id: schema.departments.id, name: schema.departments.name, divisionId: schema.departments.divisionId }).from(schema.departments).where(notDeleted(schema.departments));\n    const sections = await db.select({ id: schema.sections.id, name: schema.sections.name, departmentId: schema.sections.departmentId }).from(schema.sections).where(notDeleted(schema.sections));"
);

content = content.replace(
  "departments,",
  "departments,\n        sections,"
);

fs.writeFileSync('src/routes/orgRoutes.ts', content);
