const fs = require('fs');

let file = 'src/db/schema.ts';
let code = fs.readFileSync(file, 'utf8');

// I might have completely butchered some relations inside positionsRelations
code = code.replace(/export const positionsRelations = relations\([\s\S]*?\}\)\);/g, `export const positionsRelations = relations(positions, ({ one }) => ({
  company: one(companies, {
    fields: [positions.companyId],
    references: [companies.id],
  }),
  department: one(departments, {
    fields: [positions.departmentId],
    references: [departments.id],
  }),
  job: one(jobs, {
    fields: [positions.jobId],
    references: [jobs.id],
  }),
}));`);

fs.writeFileSync(file, code);
