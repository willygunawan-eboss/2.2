const fs = require('fs');
let content = fs.readFileSync('src/db/schema.ts', 'utf-8');

const jobGradesRegex = /export const jobGrades = sqliteTable\('job_grades', \{[\s\S]*?\}\);/;
const jobGradesReplacement = `export const jobGrades = sqliteTable('job_grades', {
  id: text('id').primaryKey(), // UUID
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  level: integer('level').notNull(),
  sequence: integer('sequence'),
  minimumSalary: real('minimum_salary'),
  maximumSalary: real('maximum_salary'),
  currency: text('currency').default('IDR'),
  description: text('description'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
});`;

const positionsRegex = /export const positions = sqliteTable\('positions', \{[\s\S]*?\}\);/;
const positionsReplacement = `export const positions = sqliteTable('positions', {
  id: text('id').primaryKey(), // UUID
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  companyId: text('company_id').notNull().references(() => companies.id),
  branchId: text('branch_id').notNull().references(() => branches.id),
  divisionId: text('division_id').notNull().references(() => divisions.id),
  departmentId: text('department_id').notNull().references(() => departments.id),
  sectionId: text('section_id').references(() => sections.id),
  teamId: text('team_id').references(() => teams.id),
  jobGradeId: text('job_grade_id').notNull().references(() => jobGrades.id),
  parentPositionId: text('parent_position_id').references((): any => positions.id),
  reportsToPositionId: text('reports_to_position_id').references((): any => positions.id),
  level: integer('level'),
  employmentTypeId: text('employment_type_id'),
  approvalLevel: integer('approval_level'),
  defaultShiftId: text('default_shift_id'),
  costCenterId: text('cost_center_id'),
  canApproveLeave: integer('can_approve_leave', { mode: 'boolean' }).default(false),
  canApprovePurchase: integer('can_approve_purchase', { mode: 'boolean' }).default(false),
  canApproveExpense: integer('can_approve_expense', { mode: 'boolean' }).default(false),
  canApproveProject: integer('can_approve_project', { mode: 'boolean' }).default(false),
  description: text('description'),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  version: integer('version').default(1),
  createdAt: text('created_at').default(sql\`CURRENT_TIMESTAMP\`),
  updatedAt: text('updated_at'),
  createdBy: text('created_by'),
  updatedBy: text('updated_by'),
  deletedAt: text('deleted_at'),
  deletedBy: text('deleted_by'),
}, (table) => {
  return {
    codeIdx: index('idx_positions_code').on(table.code),
    deptIdx: index('idx_positions_department_id').on(table.departmentId),
    sectionIdx: index('idx_positions_section_id').on(table.sectionId),
    teamIdx: index('idx_positions_team_id').on(table.teamId),
    jobGradeIdx: index('idx_positions_job_grade_id').on(table.jobGradeId),
    parentIdx: index('idx_positions_parent_position_id').on(table.parentPositionId),
    statusIdx: index('idx_positions_status').on(table.isActive)
  };
});`;

content = content.replace(jobGradesRegex, jobGradesReplacement);
content = content.replace(positionsRegex, positionsReplacement);

fs.writeFileSync('src/db/schema.ts', content);
