const fs = require('fs');

let schema = fs.readFileSync('src/db/schema.ts', 'utf-8');

const newEmployeesTable = `export const employees = sqliteTable("employees", {
  id: text("id").primaryKey(), // UUID
  employeeNumber: text("employee_number").notNull().unique(),
  nationalIdentityNumber: text("national_identity_number"),
  fullName: text("full_name").notNull(),
  preferredName: text("preferred_name"),
  birthPlace: text("birth_place"),
  birthDate: text("birth_date"),
  gender: text("gender"),
  religion: text("religion"),
  nationality: text("nationality"),
  maritalStatus: text("marital_status"),
  bloodType: text("blood_type"),
  photo: text("photo"),
  digitalSignature: text("digital_signature"),
  corporateEmail: text("corporate_email"),
  personalEmail: text("personal_email"),
  mobilePhone: text("mobile_phone"),
  homePhone: text("home_phone"),
  emergencyContactName: text("emergency_contact_name"),
  emergencyContactNumber: text("emergency_contact_number"),
  
  employmentStatus: text("employment_status"), // Master Reference (Probation, Permanent, Contract, etc.)
  employmentType: text("employment_type"),
  hireDate: text("hire_date"),
  joinDate: text("join_date"),
  confirmationDate: text("confirmation_date"),
  contractStartDate: text("contract_start_date"),
  contractEndDate: text("contract_end_date"),
  terminationDate: text("termination_date"),
  
  companyId: text("company_id").references(() => companies.id),
  branchId: text("branch_id").references(() => branches.id),
  divisionId: text("division_id").references(() => divisions.id),
  departmentId: text("department_id").references(() => departments.id),
  sectionId: text("section_id").references(() => sections.id),
  teamId: text("team_id").references(() => teams.id),
  positionId: text("position_id").references(() => positions.id),
  jobGradeId: text("job_grade_id").references(() => jobGrades.id),
  managerEmployeeId: text("manager_employee_id"), // Self relation handled in relations
  supervisorEmployeeId: text("supervisor_employee_id"), // Self relation
  
  workLocation: text("work_location"),
  shiftGroup: text("shift_group"),
  
  status: text("status").notNull().default("Active"),
  
  createdAt: text("created_at").default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});`;

// Replace the old employees table
schema = schema.replace(/export const employees = sqliteTable\("employees", \{[\s\S]*?\}\);/, newEmployeesTable);

// Find existing employeesRelations or create it.
const employeesRelationsRegex = /export const employeesRelations = relations\(employees, \(\{[\s\S]*?\}\)\);/;
const hasEmployeesRelations = employeesRelationsRegex.test(schema);

const relationStr = `export const employeesRelations = relations(employees, ({ one, many }) => ({
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
}));`;

if (hasEmployeesRelations) {
  schema = schema.replace(employeesRelationsRegex, relationStr);
} else {
  schema += '\n' + relationStr + '\n';
}

fs.writeFileSync('src/db/schema.ts', schema);
console.log("Patched schema.ts for employees");
