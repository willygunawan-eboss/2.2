const fs = require('fs');
let schema = fs.readFileSync('src/db/schema.ts', 'utf-8');

const newRelations = `export const employeesRelations = relations(employees, ({ one, many }) => ({
  company: one(companies, { fields: [employees.companyId], references: [companies.id] }),
  branch: one(branches, { fields: [employees.branchId], references: [branches.id] }),
  division: one(divisions, { fields: [employees.divisionId], references: [divisions.id] }),
  department: one(departments, { fields: [employees.departmentId], references: [departments.id] }),
  section: one(sections, { fields: [employees.sectionId], references: [sections.id] }),
  team: one(teams, { fields: [employees.teamId], references: [teams.id] }),
  position: one(positions, { fields: [employees.positionId], references: [positions.id] }),
  jobGrade: one(jobGrades, { fields: [employees.jobGradeId], references: [jobGrades.id] }),
  manager: one(employees, { fields: [employees.managerEmployeeId], references: [employees.id], relationName: "manager" }),
  supervisor: one(employees, { fields: [employees.supervisorEmployeeId], references: [employees.id], relationName: "supervisor" }),
  subordinates: many(employees, { relationName: "manager" }),
  contracts: many(employeeContracts),
  leaves: many(employeeLeaves),
  attendance: many(attendance),
  assetAssignments: many(assetAssignments),
  certifications: many(certifications),
  trainings: many(trainings),
  performances: many(employeePerformances),
  documents: many(documents),
}));`;

schema = schema.replace(/export const employeesRelations = relations\(employees, \(\{[\s\S]*?\}\)\);/, newRelations);
fs.writeFileSync('src/db/schema.ts', schema);
console.log("Patched employeesRelations");
