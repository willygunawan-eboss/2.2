import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(), // 'admin', 'employee', 'manager'
  department: text("department"),
  refreshToken: text("refresh_token"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const dashboardStats = sqliteTable("dashboard_stats", {
  id: text("id").primaryKey(), // single row, id='main'
  activeEmployees: integer("active_employees").notNull().default(0),
  totalDepartments: integer("total_departments").notNull().default(0),
  openTickets: integer("open_tickets").notNull().default(0),
  monthlyRevenue: real("monthly_revenue").notNull().default(0),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const companies = sqliteTable("companies", {
  id: text("id").primaryKey(), // UUID
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  legalName: text("legal_name"),
  businessType: text("business_type"),
  industry: text("industry"),
  taxNumber: text("tax_number"),
  registrationNumber: text("registration_number"),
  email: text("email"),
  phone: text("phone"),
  website: text("website"),
  logo: text("logo"),
  address: text("address"),
  country: text("country"),
  province: text("province"),
  city: text("city"),
  postalCode: text("postal_code"),
  currency: text("currency"),
  timezone: text("timezone"),
  language: text("language"),
  status: text("status").default("Active"),
  notes: text("notes"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});

export const companyAudits = sqliteTable("company_audits", {
  id: text("id").primaryKey(), // UUID
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id),
  action: text("action").notNull(), // CREATE, UPDATE, DELETE, RESTORE
  changes: text("changes"), // JSON string of changes
  performedBy: text("performed_by"),
  performedAt: text("performed_at").default(sql`CURRENT_TIMESTAMP`),
});

export const branchAudits = sqliteTable("branch_audits", {
  id: text("id").primaryKey(), // UUID
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  action: text("action").notNull(), // CREATE, UPDATE, DELETE, RESTORE
  changes: text("changes"), // JSON string of changes
  performedBy: text("performed_by"),
  performedAt: text("performed_at").default(sql`CURRENT_TIMESTAMP`),
});

export const branches = sqliteTable("branches", {
  id: text("id").primaryKey(), // UUID
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  branchType: text("branch_type"),
  taxNumber: text("tax_number"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  address: text("address"),
  country: text("country"),
  province: text("province"),
  city: text("city"),
  postalCode: text("postal_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  timezone: text("timezone"),
  workingCalendar: text("working_calendar"),
  defaultCurrency: text("default_currency"),
  notes: text("notes"),
  status: text("status").default("Active"),
  isDefault: integer("is_default", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});

export const divisionAudits = sqliteTable("division_audits", {
  id: text("id").primaryKey(),
  divisionId: text("division_id")
    .notNull()
    .references(() => divisions.id),
  action: text("action").notNull(),
  changes: text("changes"),
  performedBy: text("performed_by"),
  performedAt: text("performed_at").default(sql`CURRENT_TIMESTAMP`),
});

export const divisions = sqliteTable("divisions", {
  id: text("id").primaryKey(), // UUID
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("Active"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});

export const departmentAudits = sqliteTable("department_audits", {
  id: text("id").primaryKey(),
  departmentId: text("department_id")
    .notNull()
    .references(() => departments.id),
  action: text("action").notNull(),
  changes: text("changes"),
  performedBy: text("performed_by"),
  performedAt: text("performed_at").default(sql`CURRENT_TIMESTAMP`),
});

export const departments = sqliteTable("departments", {
  id: text("id").primaryKey(), // UUID
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  divisionId: text("division_id")
    .notNull()
    .references(() => divisions.id),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("Active"),
  managerPositionId: text("manager_position_id"),
  costCenter: text("cost_center"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});

export const sectionAudits = sqliteTable("section_audits", {
  id: text("id").primaryKey(),
  sectionId: text("section_id")
    .notNull()
    .references(() => sections.id),
  action: text("action").notNull(),
  changes: text("changes"),
  performedBy: text("performed_by"),
  performedAt: text("performed_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sections = sqliteTable("sections", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  divisionId: text("division_id")
    .notNull()
    .references(() => divisions.id),
  departmentId: text("department_id")
    .notNull()
    .references(() => departments.id),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("Active"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});

export const teamAudits = sqliteTable("team_audits", {
  id: text("id").primaryKey(),
  teamId: text("team_id")
    .notNull()
    .references(() => teams.id),
  action: text("action").notNull(),
  changes: text("changes"),
  performedBy: text("performed_by"),
  performedAt: text("performed_at").default(sql`CURRENT_TIMESTAMP`),
});

export const teams = sqliteTable("teams", {
  id: text("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => companies.id),
  branchId: text("branch_id")
    .notNull()
    .references(() => branches.id),
  divisionId: text("division_id")
    .notNull()
    .references(() => divisions.id),
  departmentId: text("department_id")
    .notNull()
    .references(() => departments.id),
  sectionId: text("section_id")
    .notNull()
    .references(() => sections.id),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("Active"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});

export const jobGrades = sqliteTable("job_grades", {
  id: text("id").primaryKey(), // UUID
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  level: integer("level").notNull(),
  sequence: integer("sequence"),
  minimumSalary: real("minimum_salary"),
  maximumSalary: real("maximum_salary"),
  currency: text("currency").default("IDR"),
  description: text("description"),
  companyId: text("company_id").references(() => companies.id),
  
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});

export const positions = sqliteTable(
  "positions",
  {
    id: text("id").primaryKey(), // UUID
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    jobId: text("job_id").references(() => jobs.id),
    companyId: text("company_id")
      .notNull()
      .references(() => companies.id),
    branchId: text("branch_id")
      .notNull()
      .references(() => branches.id),
    divisionId: text("division_id")
      .notNull()
      .references(() => divisions.id),
    departmentId: text("department_id")
      .notNull()
      .references(() => departments.id),
        sectionId: text("section_id").references(() => sections.id),
  teamId: text("team_id").references(() => teams.id),
  jobGradeId: text("job_grade_id")
      .notNull()
      .references(() => jobGrades.id),
    parentPositionId: text("parent_position_id").references(
      (): any => positions.id,
    ),
    reportsToPositionId: text("reports_to_position_id").references(
      (): any => positions.id,
    ),
    level: integer("level"),
    employmentTypeId: text("employment_type_id"),
    approvalLevel: integer("approval_level"),
    defaultShiftId: text("default_shift_id"),
    costCenterId: text("cost_center_id"),
    canApproveLeave: integer("can_approve_leave", { mode: "boolean" }).default(
      false,
    ),
    canApprovePurchase: integer("can_approve_purchase", {
      mode: "boolean",
    }).default(false),
    canApproveExpense: integer("can_approve_expense", {
      mode: "boolean",
    }).default(false),
    canApproveProject: integer("can_approve_project", {
      mode: "boolean",
    }).default(false),
    description: text("description"),
    isActive: integer("is_active", { mode: "boolean" }).default(true),
    version: integer("version").default(1),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at"),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
    deletedAt: text("deleted_at"),
    deletedBy: text("deleted_by"),
  },
  (table) => {
    return {
      codeIdx: index("idx_positions_code").on(table.code),
      deptIdx: index("idx_positions_department_id").on(table.departmentId),
      sectionIdx: index("idx_positions_section_id").on(table.sectionId),
      teamIdx: index("idx_positions_team_id").on(table.teamId),
      jobGradeIdx: index("idx_positions_job_grade_id").on(table.jobGradeId),
      parentIdx: index("idx_positions_parent_position_id").on(
        table.parentPositionId,
      ),
      statusIdx: index("idx_positions_status").on(table.isActive),
    };
  },
);

export const employees = sqliteTable("employees", {
  sectionId: text("section_id").references(() => sections.id),
  teamId: text("team_id").references(() => teams.id),
  id: text("id").primaryKey(), // UUID
  employeeNumber: text("employee_number").notNull().unique(),
  nationalIdentityNumber: text("national_identity_number"),
  name: text("name").notNull(),
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
  email: text("email"),
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
  
  
  
  status: text("status").notNull().default("Active"),
  
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  branches: many(branches),
  divisions: many(divisions),
  employees: many(employees),
  sections: many(sections),
}));

export const branchesRelations = relations(branches, ({ one, many }) => ({
  company: one(companies, {
    fields: [branches.companyId],
    references: [companies.id],
  }),
  employees: many(employees),
}));

export const divisionsRelations = relations(divisions, ({ one, many }) => ({
  company: one(companies, {
    fields: [divisions.companyId],
    references: [companies.id],
  }),
  departments: many(departments),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  division: one(divisions, {
    fields: [departments.divisionId],
    references: [divisions.id],
  }),
  positions: many(positions),
  employees: many(employees),
}));

export const sectionsRelations = relations(sections, ({ one, many }) => ({
  department: one(departments, {
    fields: [sections.departmentId],
    references: [departments.id],
  }),
  positions: many(positions),
  employees: many(employees),
}));

export const jobGradesRelations = relations(jobGrades, ({ many }) => ({
  positions: many(positions),
}));

export const positionsRelations = relations(positions, ({ one }) => ({
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
}));

export const attendance = sqliteTable("attendance", {
  id: text("id").primaryKey(), // UUID
  employeeId: text("employee_id")
    .notNull()
    .references(() => employees.id),
  date: text("date").notNull(),
  checkIn: text("check_in").notNull(),
  checkOut: text("check_out").notNull(),
  status: text("status").notNull(), // Present, Late, Absent, Half Day
  workHours: text("work_hours").notNull(),
});

export const payroll = sqliteTable("payroll", {
  id: text("id").primaryKey(), // UUID
  employeeId: text("employee_id")
    .notNull()
    .references(() => employees.id),
  period: text("period").notNull(),
  basicSalary: real("basic_salary").notNull(),
  allowances: real("allowances").notNull(),
  deductions: real("deductions").notNull(),
  netPay: real("net_pay").notNull(),
  status: text("status").notNull(), // Paid, Processing, Pending
});

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(), // Income, Expense
  amount: real("amount").notNull(),
  status: text("status").notNull(), // Completed, Pending
});

export const salesOrders = sqliteTable("sales_orders", {
  id: text("id").primaryKey(), // UUID
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  salespersonId: text("salesperson_id").references(() => employees.id),
  date: text("date").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull(), // Completed, Pending, Cancelled
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  stock: integer("stock").notNull(),
  status: text("status").notNull(), // In Stock, Low Stock, Out of Stock
});

export const productionOrders = sqliteTable("production_orders", {
  id: text("id").primaryKey(), // UUID
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  assignedToId: text("assigned_to_id").references(() => employees.id),
  quantity: integer("quantity").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").notNull(), // Planned, In Progress, Completed
  progress: integer("progress").notNull(),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  managerId: text("manager_id").references(() => employees.id),
  dueDate: text("due_date").notNull(),
  budget: real("budget").notNull(),
  status: text("status").notNull(), // Active, Completed, Delayed
  progress: integer("progress").notNull(),
  contractId: text("contract_id"),
});

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(), // UUID
  title: text("title").notNull(),
  assignedToId: text("assigned_to_id")
    .notNull()
    .references(() => employees.id),
  dueDate: text("due_date").notNull(),
  status: text("status").notNull(), // Pending, Approved, Completed
  type: text("type").notNull(),
});

export const announcements = sqliteTable("announcements", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
});

export const employeeContracts = sqliteTable("employee_contracts", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  contractType: text("contract_type").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  status: text("status").notNull(),
});

export const employeeFamilies = sqliteTable("employee_families", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  name: text("name").notNull(),
  relationship: text("relationship").notNull(),
  dateOfBirth: text("date_of_birth"),
});

export const employeeEmergencyContacts = sqliteTable(
  "employee_emergency_contacts",
  {
    id: text("id").primaryKey(),
    employeeId: text("employee_id").notNull(),
    name: text("name").notNull(),
    relationship: text("relationship").notNull(),
    phone: text("phone").notNull(),
  },
);

export const employeeBanks = sqliteTable("employee_banks", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  bankName: text("bank_name").notNull(),
  accountNumber: text("account_number").notNull(),
  accountHolder: text("account_holder").notNull(),
});

export const employeeTaxes = sqliteTable("employee_taxes", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  npwp: text("npwp").notNull(),
  ptkpStatus: text("ptkp_status").notNull(),
});

export const employeeBpjs = sqliteTable("employee_bpjs", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  bpjsKesehatan: text("bpjs_kesehatan"),
  bpjsKetenagakerjaan: text("bpjs_ketenagakerjaan"),
});

export const employeePositionHistories = sqliteTable(
  "employee_position_histories",
  {
    id: text("id").primaryKey(),
    employeeId: text("employee_id").notNull(),
    position: text("position").notNull(),
    department: text("department").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date"),
  },
);

export const employeeSalaryHistories = sqliteTable(
  "employee_salary_histories",
  {
    id: text("id").primaryKey(),
    employeeId: text("employee_id").notNull(),
    basicSalary: real("basic_salary").notNull(),
    effectiveDate: text("effective_date").notNull(),
  },
);

export const employeePromotionHistories = sqliteTable(
  "employee_promotion_histories",
  {
    id: text("id").primaryKey(),
    employeeId: text("employee_id").notNull(),
    oldPosition: text("old_position").notNull(),
    newPosition: text("new_position").notNull(),
    promotionDate: text("promotion_date").notNull(),
  },
);

export const employeeLeaves = sqliteTable("employee_leaves", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  leaveType: text("leave_type").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").notNull(), // Approved, Pending, Rejected
});

export const employeeOvertimes = sqliteTable("employee_overtimes", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  date: text("date").notNull(),
  hours: real("hours").notNull(),
  status: text("status").notNull(),
});

export const employeeAssets = sqliteTable("employee_assets", {
  id: text("id").primaryKey(), // UUID
  employeeId: text("employee_id")
    .notNull()
    .references(() => employees.id),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  givenDate: text("given_date").notNull(),
  returnDate: text("return_date"),
});

export const employeeCertifications = sqliteTable("employee_certifications", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  certificationName: text("certification_name").notNull(),
  institution: text("institution"),
  issueDate: text("issue_date"),
  expiryDate: text("expiry_date"),
  credentialId: text("credential_id"),
});

export const employeeTrainings = sqliteTable("employee_trainings", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  trainingName: text("training_name").notNull(),
  date: text("date").notNull(),
  result: text("result"),
});

export const employeePerformances = sqliteTable("employee_performances", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  reviewPeriod: text("review_period").notNull(),
  score: real("score").notNull(),
  comments: text("comments"),
});

export const employeeDocuments = sqliteTable("employee_documents", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  documentType: text("document_type").notNull(), // e.g., KTP, KK, Ijazah
  fileUrl: text("file_url").notNull(),
});

export const employeeShifts = sqliteTable("employee_shifts", {
  id: text("id").primaryKey(),
  employeeId: text("employee_id").notNull(),
  shiftName: text("shift_name").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});


// ==========================================
// ENTERPRISE EMPLOYMENT DOMAIN (PHASE 3)
// ==========================================
export const empPlatform = sqliteTable("emp_platform", {
  id: text("id").primaryKey(),
  employeeNumber: text("employee_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  organizationId: text("organization_id").references(() => orgPlatform.id),
  employmentType: text("employment_type").notNull(), // PERMANENT, CONTRACT, PROBATION, INTERNSHIP
  status: text("status").notNull(), // ACTIVE, INACTIVE, SUSPENDED, TERMINATED
  joinDate: text("join_date").notNull(),
  terminationDate: text("termination_date"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const empPlatformRelations = relations(empPlatform, ({ one, many }) => ({
  organization: one(orgPlatform, { fields: [empPlatform.organizationId], references: [orgPlatform.id] }),
  assignments: many(empAssignment, { relationName: "assignment_employment" })
}));

// ==========================================

export const empAssignment = sqliteTable("emp_assignment", {
  id: text("id").primaryKey(),
  employmentId: text("employment_id").notNull().references(() => empPlatform.id),
  organizationId: text("organization_id").notNull().references(() => orgPlatform.id),
  positionId: text("position_id").notNull().references(() => posPlatform.id),
  managerId: text("manager_id").references(() => empPlatform.id),
  supervisorId: text("supervisor_id").references(() => empPlatform.id),
  effectiveDate: text("effective_date").notNull(),
  endDate: text("end_date"),
  status: text("status").notNull(), // ACTIVE, INACTIVE
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const empAssignmentRelations = relations(empAssignment, ({ one }) => ({
  employment: one(empPlatform, { fields: [empAssignment.employmentId], references: [empPlatform.id], relationName: "assignment_employment" }),
  organization: one(orgPlatform, { fields: [empAssignment.organizationId], references: [orgPlatform.id], relationName: "assignment_organization" }),
  position: one(posPlatform, { fields: [empAssignment.positionId], references: [posPlatform.id], relationName: "assignment_position" }),
  
  
}));

// ==========================================


// ==========================================
// ENTERPRISE JOB ARCHITECTURE DOMAIN (PHASE 3)
// ==========================================
export const jobFamily = sqliteTable("job_family", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const jobGrade = sqliteTable("job_grade", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  level: integer("level").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const jobPlatform = sqliteTable("job_platform", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  jobFamilyId: text("job_family_id").notNull().references(() => jobFamily.id),
  sectionId: text("section_id").references(() => sections.id),
  teamId: text("team_id").references(() => teams.id),
  jobGradeId: text("job_grade_id").notNull().references(() => jobGrade.id),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const jobFamilyRelations = relations(jobFamily, ({ many }) => ({
  jobs: many(jobPlatform)
}));

export const jobGradeRelations = relations(jobGrade, ({ many }) => ({
  jobs: many(jobPlatform)
}));

export const jobPlatformRelations = relations(jobPlatform, ({ one, many }) => ({
  jobFamily: one(jobFamily, { fields: [jobPlatform.jobFamilyId], references: [jobFamily.id] }),
  jobGrade: one(jobGrade, { fields: [jobPlatform.jobGradeId], references: [jobGrade.id] }),
  positions: many(posPlatform)
}));

// ==========================================
// ENTERPRISE POSITION DOMAIN (PHASE 3)
// ==========================================
export const posPlatform = sqliteTable("pos_platform", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  companyId: text("company_id").references(() => orgPlatform.id),
  jobId: text("job_id").references(() => jobPlatform.id),
  employmentType: text("employment_type"), // E.g., PERMANENT, CONTRACT, ALL
  status: text("status").notNull().default("ACTIVE"),
  effectiveDate: text("effective_date").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at")
});

export const posPlatformRelations = relations(posPlatform, ({ one, many }) => ({
  company: one(orgPlatform, { fields: [posPlatform.companyId], references: [orgPlatform.id] }),
  job: one(jobPlatform, { fields: [posPlatform.jobId], references: [jobPlatform.id] }),
  assignments: many(empAssignment, { relationName: "assignment_position" })
}));

// ==========================================
// ENTERPRISE ASSET DOMAIN
// ==========================================

export const assetCategories = sqliteTable("asset_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const manufacturers = sqliteTable("manufacturers", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  supportContact: text("support_contact"),
  website: text("website"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetModels = sqliteTable("asset_models", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  manufacturerId: text("manufacturer_id").references(() => manufacturers.id),
  categoryId: text("category_id").references(() => assetCategories.id),
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetLocations = sqliteTable("asset_locations", {
  id: text("id").primaryKey(),
  branchId: text("branch_id").references(() => branches.id),
  name: text("name").notNull(),
  address: text("address"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assets = sqliteTable(
  "assets",
  {
    id: text("id").primaryKey(),
    assetCode: text("asset_code").notNull().unique(), // Replacing old assetId
    name: text("name").notNull(),
    serialNumber: text("serial_number"),
    barcode: text("barcode"),
    qrCode: text("qr_code"),
    customerId: text("customer_id").references(() => customers.id),
    contractId: text("contract_id").references(() => contracts.id),
    projectId: text("project_id").references(() => projects.id),
    ownerCompanyId: text("owner_company_id").references(() => companies.id),
      categoryId: text("category_id").references(() => assetCategories.id),
    modelId: text("model_id").references(() => assetModels.id),
    manufacturerId: text("manufacturer_id").references(() => manufacturers.id),
    vendor: text("vendor"),
    purchaseDate: text("purchase_date"),
    warrantyStart: text("warranty_start"),
    warrantyEnd: text("warranty_end"),
    installationDate: text("installation_date"),
    commissionDate: text("commission_date"),
    endOfSupport: text("end_of_support"),
    endOfLife: text("end_of_life"),
    status: text("status").notNull().default("Active"),
    condition: text("condition"),
    locationId: text("location_id").references(() => assetLocations.id),
  departmentId: text("department_id").references(() => departments.id),
    rack: text("rack"),
    room: text("room"),
    gps: text("gps"),
    latitude: text("latitude"),
    longitude: text("longitude"),
    ipAddress: text("ip_address"),
    macAddress: text("mac_address"),
    hostname: text("hostname"),
    operatingSystem: text("operating_system"),
    firmware: text("firmware"),
    modelNumber: text("model_number"),
    assetValue: real("asset_value"),
    residualValue: real("residual_value"),
    description: text("description"),

    // Legacy fields to not break existing queries completely if possible
    // Old queries may ask for 'category' (text), 'currentValue' (integer), 'assetId' (text)
    // Re-adding them here as optional/nullable to satisfy old relations and queries
    category: text("legacy_category"),
    currentValue: integer("current_value"),
    assetId: text("legacy_asset_id"),
    assignedToId: text("assigned_to_id").references(() => employees.id),

    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    createdBy: text("created_by"),
    updatedAt: text("updated_at"),
    updatedBy: text("updated_by"),
    deletedAt: text("deleted_at"),
    deletedBy: text("deleted_by"),
  },
  (table) => {
    return {
      assetCodeIdx: index("asset_code_idx").on(table.assetCode),
      customerIdx: index("asset_customer_idx").on(table.customerId),
      contractIdx: index("asset_contract_idx").on(table.contractId),
      statusIdx: index("asset_status_idx").on(table.status),
    };
  },
);

export const assetAssignments = sqliteTable("asset_assignments", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  assignedToId: text("assigned_to_id")
    .notNull()
    .references(() => employees.id),
  assignmentDate: text("assignment_date"),
  returnDate: text("return_date"),
  notes: text("notes"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetWarranties = sqliteTable("asset_warranties", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  vendor: text("vendor"),
  warrantyNumber: text("warranty_number"),
  warrantyType: text("warranty_type"),
  responseTime: text("response_time"),
  coverage: text("coverage"),
  replacement: integer("replacement", { mode: "boolean" }).default(false),
  rma: text("rma"),
  warrantyExpiration: text("warranty_expiration"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetMaintenances = sqliteTable("asset_maintenances", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  type: text("type"), // Preventive, Corrective, Emergency
  scheduleDate: text("schedule_date"),
  engineerId: text("engineer_id").references(() => employees.id),
  worklog: text("worklog"),
  checklist: text("checklist"),
  downtime: text("downtime"), // e.g. "2 hours"
  maintenanceResult: text("maintenance_result"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetMaintenanceSchedules = sqliteTable(
  "asset_maintenance_schedules",
  {
    id: text("id").primaryKey(),
    assetId: text("asset_id")
      .notNull()
      .references(() => assets.id),
    frequency: text("frequency"),
    nextScheduleDate: text("next_schedule_date"),
    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    createdBy: text("created_by"),
  },
);

export const assetLicenses = sqliteTable("asset_licenses", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  licenseType: text("license_type"), // Windows, VMware, etc.
  licenseKey: text("license_key"),
  licenseStart: text("license_start"),
  licenseEnd: text("license_end"),
  renewalReminder: text("renewal_reminder"), // e.g. 30 days
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetConfigurations = sqliteTable("asset_configurations", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  cpu: text("cpu"),
  memory: text("memory"),
  storage: text("storage"),
  raid: text("raid"),
  networkInterface: text("network_interface"),
  operatingSystem: text("operating_system"),
  virtualization: text("virtualization"),
  database: text("database"),
  application: text("application"),
  dependencies: text("dependencies"),
  configurationVersion: text("configuration_version"),
  backupConfiguration: text("backup_configuration"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetNetworks = sqliteTable("asset_networks", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  publicIp: text("public_ip"),
  privateIp: text("private_ip"),
  subnet: text("subnet"),
  gateway: text("gateway"),
  dns: text("dns"),
  vlan: text("vlan"),
  switchPort: text("switch_port"),
  router: text("router"),
  firewall: text("firewall"),
  vpn: text("vpn"),
  internetProvider: text("internet_provider"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetMonitorings = sqliteTable("asset_monitorings", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  alertType: text("alert_type"),
  alertMessage: text("alert_message"),
  severity: text("severity"),
  timestamp: text("timestamp"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetDocuments = sqliteTable("asset_documents", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  documentType: text("document_type"), // Manual, Invoice, etc.
  documentName: text("document_name"),
  fileUrl: text("file_url"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetAttachments = sqliteTable("asset_attachments", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  fileName: text("file_name"),
  fileUrl: text("file_url"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetHistories = sqliteTable("asset_histories", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  action: text("action"),
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const assetDisposals = sqliteTable("asset_disposals", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  disposalDate: text("disposal_date"),
  disposalMethod: text("disposal_method"),
  disposalReason: text("disposal_reason"),
  approvedBy: text("approved_by").references(() => employees.id),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const invoices = sqliteTable("invoices", {
  id: text("id").primaryKey(), // UUID
  invoiceNumber: text("invoice_number").notNull().unique(),
  date: text("date").notNull(),
  dueDate: text("due_date").notNull(),
  salespersonId: text("salesperson_id").references(() => employees.id),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  subtotal: integer("subtotal").notNull(),
  discountTotal: integer("discount_total").notNull().default(0),
  additionalDiscount: integer("additional_discount").notNull().default(0),
  shippingCost: integer("shipping_cost").notNull().default(0),
  taxTotal: integer("tax_total").notNull().default(0),
  downPayment: integer("down_payment").notNull().default(0),
  total: integer("total").notNull(),
  amountPaid: integer("amount_paid").notNull().default(0),
  amountDue: integer("amount_due").notNull(),
  notes: text("notes"),
  terms: text("terms"),
  signatureDate: text("signature_date"),
  signatureName: text("signature_name"),
  status: text("status").notNull().default("Unpaid"),
});

export const invoiceItems = sqliteTable("invoice_items", {
  id: text("id").primaryKey(),
  invoiceId: text("invoice_id").notNull(),
  productName: text("product_name").notNull(),
  description: text("description"),
  quantity: integer("quantity").notNull().default(1),
  price: integer("price").notNull(),
  discountPercent: integer("discount_percent").notNull().default(0),
  taxType: text("tax_type").default("No Tax Selected"),
  total: integer("total").notNull(),
});

export const purchaseOrders = sqliteTable("purchase_orders", {
  id: text("id").primaryKey(), // UUID
  vendorId: text("vendor_id")
    .notNull()
    .references(() => vendors.id),
  date: text("date").notNull(),
  amount: real("amount").notNull(),
  status: text("status").notNull(), // Pending, Received, Cancelled
});

export const purchaseOrderItems = sqliteTable("purchase_order_items", {
  id: text("id").primaryKey(),
  purchaseOrderId: text("purchase_order_id").notNull(),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

export const salesOrderItems = sqliteTable("sales_order_items", {
  id: text("id").primaryKey(),
  salesOrderId: text("sales_order_id").notNull(),
  productId: text("product_id").notNull(),
  quantity: integer("quantity").notNull(),
  price: real("price").notNull(),
});

export const inventoryTransactions = sqliteTable("inventory_transactions", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull(),
  type: text("type").notNull(), // IN, OUT
  quantity: integer("quantity").notNull(),
  date: text("date").notNull(),
  referenceId: text("reference_id").notNull(), // PO or SO ID
  referenceType: text("reference_type").notNull(), // PO, SO, MANUAL
});

export const vendors = sqliteTable("vendors", {
  id: text("id").primaryKey(), // UUID
  name: text("name").notNull(),
  pic: text("pic").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  npwp: text("npwp"),
  status: text("status").notNull().default("Active"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
export const customers = sqliteTable(
  "customers",
  {
    id: text("id").primaryKey(),
    branchId: text("branch_id").references(() => branches.id),
    code: text("code").notNull().unique(),
    name: text("name").notNull(),
    legalName: text("legal_name"),
    npwp: text("npwp"),
    email: text("email"),
    website: text("website"),
    phone: text("phone"),
    industryId: text("industry_id"),
    categoryId: text("category_id"),
    groupId: text("group_id"),
    statusId: text("status_id").default("Active"),
    priorityId: text("priority_id"),
    currencyId: text("currency_id"),
    paymentTermId: text("payment_term_id"),
    salespersonId: text("salesperson_id").references(() => employees.id),
    accountManagerId: text("account_manager_id").references(() => employees.id),
  
  companyId: text("company_id").references(() => companies.id),
    
    // Legacy fields for compatibility if needed, or we can drop them. We keep pic just in case.
    pic: text("pic"),
    address: text("address"),

    // Audit
    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    createdBy: text("created_by"),
    updatedAt: text("updated_at"),
    updatedBy: text("updated_by"),
    deletedAt: text("deleted_at"),
    deletedBy: text("deleted_by"),
  },
  (table) => {
    return {
      nameIdx: index("name_idx").on(table.name),
      codeIdx: index("code_idx").on(table.code),
      industryIdx: index("industry_idx").on(table.industryId),
      categoryIdx: index("category_idx").on(table.categoryId),
    };
  },
);

export const customerContacts = sqliteTable("customer_contacts", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  name: text("name").notNull(),
  title: text("title"),
  contactType: text("contact_type"), // Technical PIC, Finance PIC, Management PIC, Emergency Contact
  email: text("email"),
  phone: text("phone"),
  mobile: text("mobile"),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),
  notes: text("notes"),

  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
  updatedAt: text("updated_at"),
  updatedBy: text("updated_by"),
});

export const customerAddresses = sqliteTable("customer_addresses", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  addressType: text("address_type"), // Head Office, Billing Address, Shipping Address, Branch Office
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  mapsUrl: text("maps_url"),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),

  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
  updatedAt: text("updated_at"),
  updatedBy: text("updated_by"),
});

export const customerCommunications = sqliteTable("customer_communications", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  contactId: text("contact_id").references(() => customerContacts.id),
  employeeId: text("employee_id").references(() => employees.id),
  channel: text("channel"), // Email, Phone, WhatsApp, Telegram, Meeting, Call
  direction: text("direction"), // Inbound, Outbound
  communicationDate: text("communication_date").notNull(),
  subject: text("subject"),
  notes: text("notes"),

  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const customerBankAccounts = sqliteTable("customer_bank_accounts", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  bankName: text("bank_name").notNull(),
  accountName: text("account_name").notNull(),
  accountNumber: text("account_number").notNull(),
  swiftCode: text("swift_code"),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),

  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
  updatedAt: text("updated_at"),
  updatedBy: text("updated_by"),
});

export const customerDocuments = sqliteTable("customer_documents", {
  id: text("id").primaryKey(),
  customerId: text("customer_id")
    .notNull()
    .references(() => customers.id),
  documentType: text("document_type"), // NPWP, NIB, Contract, Other
  documentName: text("document_name").notNull(),
  fileUrl: text("file_url"),
  expiryDate: text("expiry_date"),

  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
  updatedAt: text("updated_at"),
  updatedBy: text("updated_by"),
});

export const customerRelations = relations(customers, ({ many, one }) => ({
  contracts: many(contracts),
  contacts: many(customerContacts),
  addresses: many(customerAddresses),
  communications: many(customerCommunications),
  bankAccounts: many(customerBankAccounts),
  documents: many(customerDocuments),
  salesperson: one(employees, {
    fields: [customers.salespersonId],
    references: [employees.id],
  }),
  accountManager: one(employees, {
    fields: [customers.accountManagerId],
    references: [employees.id],
  }),
}));

export const assetsRelations = relations(assets, ({ one, many }) => ({
  category: one(assetCategories, {
    fields: [assets.categoryId],
    references: [assetCategories.id],
  }),
  manufacturer: one(manufacturers, {
    fields: [assets.manufacturerId],
    references: [manufacturers.id],
  }),
  model: one(assetModels, {
    fields: [assets.modelId],
    references: [assetModels.id],
  }),
  location: one(assetLocations, {
    fields: [assets.locationId],
    references: [assetLocations.id],
  }),
  department: one(departments, {
    fields: [assets.departmentId],
    references: [departments.id],
  }),
  assignedEmployee: one(employees, {
    fields: [assets.assignedToId],
    references: [employees.id],
  }),

  assignments: many(assetAssignments),
  warranties: many(assetWarranties),
  maintenances: many(assetMaintenances),
  maintenanceSchedules: many(assetMaintenanceSchedules),
  licenses: many(assetLicenses),
  configurations: many(assetConfigurations),
  networks: many(assetNetworks),
  monitorings: many(assetMonitorings),
  documents: many(assetDocuments),
  attachments: many(assetAttachments),
  histories: many(assetHistories),
  disposals: many(assetDisposals),
  tickets: many(tickets), // from existing tickets relation
  cis: many(cis),
}));

export const assetCategoriesRelations = relations(
  assetCategories,
  ({ many }) => ({
    assets: many(assets),
    models: many(assetModels),
  }),
);

export const manufacturersRelations = relations(manufacturers, ({ many }) => ({
  assets: many(assets),
  models: many(assetModels),
}));

export const assetModelsRelations = relations(assetModels, ({ one, many }) => ({
  manufacturer: one(manufacturers, {
    fields: [assetModels.manufacturerId],
    references: [manufacturers.id],
  }),
  category: one(assetCategories, {
    fields: [assetModels.categoryId],
    references: [assetCategories.id],
  }),
  assets: many(assets),
}));

export const assetLocationsRelations = relations(
  assetLocations,
  ({ one, many }) => ({
    branch: one(branches, {
      fields: [assetLocations.branchId],
      references: [branches.id],
    }),
    assets: many(assets),
  }),
);

export const assetAssignmentsRelations = relations(
  assetAssignments,
  ({ one }) => ({
    asset: one(assets, {
      fields: [assetAssignments.assetId],
      references: [assets.id],
    }),
    assignee: one(employees, {
      fields: [assetAssignments.assignedToId],
      references: [employees.id],
      relationName: "employeeAssignments",
    }),
  }),
);

export const assetWarrantiesRelations = relations(
  assetWarranties,
  ({ one }) => ({
    asset: one(assets, {
      fields: [assetWarranties.assetId],
      references: [assets.id],
    }),
  }),
);

export const assetMaintenancesRelations = relations(
  assetMaintenances,
  ({ one }) => ({
    asset: one(assets, {
      fields: [assetMaintenances.assetId],
      references: [assets.id],
    }),
    engineer: one(employees, {
      fields: [assetMaintenances.engineerId],
      references: [employees.id],
    }),
  }),
);

export const assetMaintenanceSchedulesRelations = relations(
  assetMaintenanceSchedules,
  ({ one }) => ({
    asset: one(assets, {
      fields: [assetMaintenanceSchedules.assetId],
      references: [assets.id],
    }),
  }),
);

export const assetLicensesRelations = relations(assetLicenses, ({ one }) => ({
  asset: one(assets, {
    fields: [assetLicenses.assetId],
    references: [assets.id],
  }),
}));

export const assetConfigurationsRelations = relations(
  assetConfigurations,
  ({ one }) => ({
    asset: one(assets, {
      fields: [assetConfigurations.assetId],
      references: [assets.id],
    }),
  }),
);

export const assetNetworksRelations = relations(assetNetworks, ({ one }) => ({
  asset: one(assets, {
    fields: [assetNetworks.assetId],
    references: [assets.id],
  }),
}));

export const assetMonitoringsRelations = relations(
  assetMonitorings,
  ({ one }) => ({
    asset: one(assets, {
      fields: [assetMonitorings.assetId],
      references: [assets.id],
    }),
  }),
);

export const assetDocumentsRelations = relations(assetDocuments, ({ one }) => ({
  asset: one(assets, {
    fields: [assetDocuments.assetId],
    references: [assets.id],
  }),
}));

export const assetAttachmentsRelations = relations(
  assetAttachments,
  ({ one }) => ({
    asset: one(assets, {
      fields: [assetAttachments.assetId],
      references: [assets.id],
    }),
  }),
);

export const assetHistoriesRelations = relations(assetHistories, ({ one }) => ({
  asset: one(assets, {
    fields: [assetHistories.assetId],
    references: [assets.id],
  }),
}));

export const assetDisposalsRelations = relations(assetDisposals, ({ one }) => ({
  asset: one(assets, {
    fields: [assetDisposals.assetId],
    references: [assets.id],
  }),
  approver: one(employees, {
    fields: [assetDisposals.approvedBy],
    references: [employees.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  contract: one(contracts, {
    fields: [projects.contractId],
    references: [contracts.id],
  }),
}));

// ==========================================
// ENTERPRISE CMDB DOMAIN
// ==========================================

export const ciCategories = sqliteTable("ci_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const ciEnvironments = sqliteTable("ci_environments", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(), // Production, Staging, Dev, Test
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const ciStatuses = sqliteTable("ci_statuses", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(), // Active, Maintenance, Retired
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const cis = sqliteTable(
  "cis",
  {
    id: text("id").primaryKey(),
    ciCode: text("ci_code").notNull().unique(),
    name: text("name").notNull(),
    ciType: text("ci_type"), // Business Service, Application Service, Infrastructure Service, Database Service, Virtual Machine, Container, Cloud Resource
    categoryId: text("category_id").references(() => ciCategories.id),
    customerId: text("customer_id").references(() => customers.id),
    contractId: text("contract_id").references(() => contracts.id),
    assetId: text("asset_id").references(() => assets.id),
    projectId: text("project_id").references(() => projects.id),
    environmentId: text("environment_id").references(() => ciEnvironments.id),
    statusId: text("status_id").references(() => ciStatuses.id),
    criticality: text("criticality"), // High, Medium, Low
    ownerId: text("owner_id").references(() => employees.id),
    businessOwnerId: text("business_owner_id").references(() => employees.id),
    technicalOwnerId: text("technical_owner_id").references(() => employees.id),
    supportGroupId: text("support_group_id").references(() => departments.id),
    monitoringProfile: text("monitoring_profile"),
    location: text("location"),
    description: text("description"),

    isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
    createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
    createdBy: text("created_by"),
    updatedAt: text("updated_at"),
    updatedBy: text("updated_by"),
  },
  (table) => {
    return {
      ciCodeIdx: index("ci_code_idx").on(table.ciCode),
      customerIdx: index("ci_customer_idx").on(table.customerId),
      assetIdx: index("ci_asset_idx").on(table.assetId),
    };
  },
);

export const ciRelationships = sqliteTable("ci_relationships", {
  id: text("id").primaryKey(),
  parentCiId: text("parent_ci_id")
    .notNull()
    .references(() => cis.id),
  childCiId: text("child_ci_id")
    .notNull()
    .references(() => cis.id),
  dependencyType: text("dependency_type"), // Runs on, Depends on, Connected to, Contains
  impactLevel: text("impact_level"), // High, Medium, Low
  priority: integer("priority"),
  relationshipDirection: text("relationship_direction"), // Parent-to-Child, Child-to-Parent, Bi-directional
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const ciHistories = sqliteTable("ci_histories", {
  id: text("id").primaryKey(),
  ciId: text("ci_id")
    .notNull()
    .references(() => cis.id),
  action: text("action"),
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const ciDocuments = sqliteTable("ci_documents", {
  id: text("id").primaryKey(),
  ciId: text("ci_id")
    .notNull()
    .references(() => cis.id),
  documentName: text("document_name"),
  fileUrl: text("file_url"),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const ciTags = sqliteTable("ci_tags", {
  id: text("id").primaryKey(),
  ciId: text("ci_id")
    .notNull()
    .references(() => cis.id),
  tag: text("tag").notNull(),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
});

export const cisRelations = relations(cis, ({ one, many }) => ({
  category: one(ciCategories, {
    fields: [cis.categoryId],
    references: [ciCategories.id],
  }),
  customer: one(customers, {
    fields: [cis.customerId],
    references: [customers.id],
  }),
  contract: one(contracts, {
    fields: [cis.contractId],
    references: [contracts.id],
  }),
  asset: one(assets, { fields: [cis.assetId], references: [assets.id] }),
  project: one(projects, {
    fields: [cis.projectId],
    references: [projects.id],
  }),
  environment: one(ciEnvironments, {
    fields: [cis.environmentId],
    references: [ciEnvironments.id],
  }),
  status: one(ciStatuses, {
    fields: [cis.statusId],
    references: [ciStatuses.id],
  }),
  owner: one(employees, { fields: [cis.ownerId], references: [employees.id] }),
  businessOwner: one(employees, {
    fields: [cis.businessOwnerId],
    references: [employees.id],
  }),
  technicalOwner: one(employees, {
    fields: [cis.technicalOwnerId],
    references: [employees.id],
  }),
  supportGroup: one(departments, {
    fields: [cis.supportGroupId],
    references: [departments.id],
  }),

  parentRelationships: many(ciRelationships, {
    relationName: "childRelations",
  }),
  childRelationships: many(ciRelationships, {
    relationName: "parentRelations",
  }),

  histories: many(ciHistories),
  documents: many(ciDocuments),
  tags: many(ciTags),
}));

export const ciRelationshipsRelations = relations(
  ciRelationships,
  ({ one }) => ({
    parentCi: one(cis, {
      fields: [ciRelationships.parentCiId],
      references: [cis.id],
      relationName: "parentRelations",
    }),
    childCi: one(cis, {
      fields: [ciRelationships.childCiId],
      references: [cis.id],
      relationName: "childRelations",
    }),
  }),
);

export const ciHistoriesRelations = relations(ciHistories, ({ one }) => ({
  ci: one(cis, { fields: [ciHistories.ciId], references: [cis.id] }),
}));

export const ciDocumentsRelations = relations(ciDocuments, ({ one }) => ({
  ci: one(cis, { fields: [ciDocuments.ciId], references: [cis.id] }),
}));

export const ciTagsRelations = relations(ciTags, ({ one }) => ({
  ci: one(cis, { fields: [ciTags.ciId], references: [cis.id] }),
}));

// === MOVED RELATIONS ===
export const employeesRelations = relations(employees, ({ one, many }) => ({
  section: one(sections, { fields: [employees.sectionId], references: [sections.id] }),
  team: one(teams, { fields: [employees.teamId], references: [teams.id] }),
  subordinates: many(employees, { relationName: "manager" }),
  contracts: many(employeeContracts),
  leaves: many(employeeLeaves),
  attendance: many(attendance),
  assetAssignments: many(assetAssignments),
  certifications: many(employeeCertifications),
  trainings: many(employeeTrainings),
  performances: many(employeePerformances),
  documents: many(employeeDocuments),
}));

export const employeeContractsRelations = relations(
  employeeContracts,
  ({ one }) => ({
    employee: one(employees, {
      fields: [employeeContracts.employeeId],
      references: [employees.id],
    }),
  }),
);
export const employeeLeavesRelations = relations(employeeLeaves, ({ one }) => ({
  employee: one(employees, {
    fields: [employeeLeaves.employeeId],
    references: [employees.id],
  }),
}));
export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.id],
  }),
}));
export const employeeCertificationsRelations = relations(
  employeeCertifications,
  ({ one }) => ({
    employee: one(employees, {
      fields: [employeeCertifications.employeeId],
      references: [employees.id],
    }),
  }),
);
export const employeeTrainingsRelations = relations(
  employeeTrainings,
  ({ one }) => ({
    employee: one(employees, {
      fields: [employeeTrainings.employeeId],
      references: [employees.id],
    }),
  }),
);
export const employeePerformancesRelations = relations(
  employeePerformances,
  ({ one }) => ({
    employee: one(employees, {
      fields: [employeePerformances.employeeId],
      references: [employees.id],
    }),
  }),
);
export const employeeDocumentsRelations = relations(
  employeeDocuments,
  ({ one }) => ({
    employee: one(employees, {
      fields: [employeeDocuments.employeeId],
      references: [employees.id],
    }),
  }),
);


// ==========================================
// BUSINESS PROCESS ENGINE (CORE PLATFORM)
// ==========================================

export const processDefinitions = sqliteTable("process_definitions", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(), // e.g. EMPLOYEE_PROMOTION, PURCHASE_ORDER
  name: text("name").notNull(),
  description: text("description"),
  version: integer("version").notNull().default(1),
  statesConfigJson: text("states_config_json"), // JSON string defining valid states
  transitionsConfigJson: text("transitions_config_json"), // JSON string defining valid transitions
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by")
});

export const processInstances = sqliteTable("process_instances", {
  id: text("id").primaryKey(),
  definitionId: text("definition_id").notNull().references(() => processDefinitions.id),
  entityId: text("entity_id").notNull(), // The ID of the Business Entity (Employee, Customer, etc.)
  entityType: text("entity_type").notNull(), // e.g., 'EMPLOYEE', 'CUSTOMER', 'ASSET'
  currentState: text("current_state").notNull(), // e.g., 'DRAFT', 'APPROVED'
  status: text("status").notNull(), // 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED'
  startedBy: text("started_by"),
  startedAt: text("started_at").default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
  metadataJson: text("metadata_json"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
}, (table) => {
  return {
    entityIdx: index("pi_entity_idx").on(table.entityType, table.entityId)
  }
});

export const processEvents = sqliteTable("process_events", {
  id: text("id").primaryKey(),
  eventName: text("event_name").notNull(),
  eventVersion: text("event_version").notNull().default("1.0"),
  traceId: text("trace_id").notNull(),
  correlationId: text("correlation_id"),
  sourceModule: text("source_module"),
  payloadJson: text("payload_json"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});

export const processActivities = sqliteTable("process_activities", {
  id: text("id").primaryKey(),
  processInstanceId: text("process_instance_id").notNull().references(() => processInstances.id),
  traceId: text("trace_id"),
  activityType: text("activity_type").notNull(), // e.g., 'TRANSITION', 'COMMENT', 'APPROVAL'
  who: text("who"), // User ID or System
  what: text("what"), // Description
  when: text("when").default(sql`CURRENT_TIMESTAMP`),
  where: text("where"), // Module or IP
  result: text("result"), // 'SUCCESS', 'FAILED'
  referenceId: text("reference_id"), // Optional reference to another record
  metadataJson: text("metadata_json")
});

export const processTasks = sqliteTable("process_tasks", {
  id: text("id").primaryKey(),
  processInstanceId: text("process_instance_id").notNull().references(() => processInstances.id),
  assigneeId: text("assignee_id"), // Employee ID
  roleId: text("role_id"), // Or Role ID
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("PENDING"), // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  dueDate: text("due_date"),
  completedAt: text("completed_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
});

export const processApprovals = sqliteTable("process_approvals", {
  id: text("id").primaryKey(),
  processInstanceId: text("process_instance_id").notNull().references(() => processInstances.id),
  approverId: text("approver_id"), // Employee ID
  roleId: text("role_id"), // Role ID
  level: integer("level").notNull().default(1),
  status: text("status").notNull().default("PENDING"), // PENDING, APPROVED, REJECTED, DELEGATED
  notes: text("notes"),
  decidedAt: text("decided_at"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
});

export const processComments = sqliteTable("process_comments", {
  id: text("id").primaryKey(),
  processInstanceId: text("process_instance_id").notNull().references(() => processInstances.id),
  authorId: text("author_id"),
  content: text("content").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
});

export const processAttachments = sqliteTable("process_attachments", {
  id: text("id").primaryKey(),
  processInstanceId: text("process_instance_id").notNull().references(() => processInstances.id),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  uploadedBy: text("uploaded_by"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});

export const processDefinitionsRelations = relations(processDefinitions, ({ many }) => ({
  instances: many(processInstances)
}));

export const processInstancesRelations = relations(processInstances, ({ one, many }) => ({
  definition: one(processDefinitions, { fields: [processInstances.definitionId], references: [processDefinitions.id] }),
  activities: many(processActivities),
  tasks: many(processTasks),
  approvals: many(processApprovals),
  comments: many(processComments),
  attachments: many(processAttachments)
}));

export const processActivitiesRelations = relations(processActivities, ({ one }) => ({
  instance: one(processInstances, { fields: [processActivities.processInstanceId], references: [processInstances.id] })
}));
export const processTasksRelations = relations(processTasks, ({ one }) => ({
  instance: one(processInstances, { fields: [processTasks.processInstanceId], references: [processInstances.id] })
}));
export const processApprovalsRelations = relations(processApprovals, ({ one }) => ({
  instance: one(processInstances, { fields: [processApprovals.processInstanceId], references: [processInstances.id] })
}));
export const processCommentsRelations = relations(processComments, ({ one }) => ({
  instance: one(processInstances, { fields: [processComments.processInstanceId], references: [processInstances.id] })
}));
export const processAttachmentsRelations = relations(processAttachments, ({ one }) => ({
  instance: one(processInstances, { fields: [processAttachments.processInstanceId], references: [processInstances.id] })
}));


// ==========================================
// ENTERPRISE ORGANIZATION PLATFORM (CORE)
// ==========================================

export const orgPlatform = sqliteTable("org_platform", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // COMPANY, BRANCH, DIVISION, DEPARTMENT, SECTION, TEAM, POSITION
  level: integer("level").notNull().default(0), // Calculated Depth
  parentId: text("parent_id").references(() => orgPlatform.id), // References orgPlatform.id
  path: text("path"), // Materialized Path
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  effectiveDate: text("effective_date").default(sql`CURRENT_TIMESTAMP`),
  version: integer("version").notNull().default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at"),
  createdBy: text("created_by"),
  updatedBy: text("updated_by"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by")
});

export const orgRelationships = sqliteTable("org_relationships", {
  id: text("id").primaryKey(),
  ancestorId: text("ancestor_id").notNull(),
  descendantId: text("descendant_id").notNull(),
  depth: integer("depth").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});

export const orgTimeline = sqliteTable("org_timeline", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  action: text("action").notNull(), // CREATED, UPDATED, MOVED, ACTIVATED, DEACTIVATED, RESTORED, DELETED
  oldValueJson: text("old_value_json"),
  newValueJson: text("new_value_json"),
  actor: text("actor").notNull(),
  traceId: text("trace_id"),
  correlationId: text("correlation_id"),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`)
});

export const orgAudit = sqliteTable("org_audit", {
  id: text("id").primaryKey(),
  orgId: text("org_id").notNull(),
  action: text("action").notNull(),
  changesJson: text("changes_json"),
  actor: text("actor").notNull(),
  timestamp: text("timestamp").default(sql`CURRENT_TIMESTAMP`)
});

export const orgPlatformRelations = relations(orgPlatform, ({ one, many }) => ({
  parent: one(orgPlatform, { fields: [orgPlatform.parentId], references: [orgPlatform.id], relationName: "parent_child" }),
  children: many(orgPlatform, { relationName: "parent_child" })
}));


export const roles = sqliteTable("roles", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  groupId: text("group_id").references(() => roleGroups.id),
  isSystem: integer("is_system", { mode: "boolean" }).default(false),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  isDeleted: integer("is_deleted", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  createdBy: text("created_by"),
  updatedAt: text("updated_at"),
  updatedBy: text("updated_by"),
});

export const roleGroups = sqliteTable("role_groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
});

export const permissions = sqliteTable("permissions", {
  id: text("id").primaryKey(),
  module: text("module").notNull(), // e.g., Dashboard, Ticket, Invoice
  action: text("action").notNull(), // e.g., View, Create, Update, Delete, Approve
  name: text("name").notNull(),
  description: text("description"),
  isSystem: integer("is_system", { mode: 'boolean' }).default(false),
});

export const rolePermissions = sqliteTable("role_permissions", {
  id: text("id").primaryKey(),
  roleId: text("role_id").notNull().references(() => roles.id),
  permissionId: text("permission_id").notNull().references(() => permissions.id),
});

export const userRoles = sqliteTable("user_roles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  roleId: text("role_id").notNull().references(() => roles.id),
});

export const dataScopes = sqliteTable("data_scopes", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(), // e.g., Self, Department, Division, Branch, Company, Global
  description: text("description"),
  level: integer("level").notNull(), // lower means more restricted
});

export const roleDataScopes = sqliteTable("role_data_scopes", {
  id: text("id").primaryKey(),
  roleId: text("role_id").notNull().references(() => roles.id),
  module: text("module").notNull(),
  scopeId: text("scope_id").notNull().references(() => dataScopes.id),
});

export const menuPermissions = sqliteTable("menu_permissions", {
  id: text("id").primaryKey(),
  roleId: text("role_id").notNull().references(() => roles.id),
  menu: text("menu").notNull(), // e.g., Dashboard, CRM, Sales, etc.
});

export const approvalLevels = sqliteTable("approval_levels", {
  id: text("id").primaryKey(),
  roleId: text("role_id").notNull().references(() => roles.id),
  module: text("module").notNull(), // e.g., Purchase, Invoice
  minAmount: integer("min_amount").notNull(),
  maxAmount: integer("max_amount"), // null means unlimited
  levelOrder: integer("level_order").notNull(),
});

export const auditPermissions = sqliteTable("audit_permissions", {
  id: text("id").primaryKey(),
  actorId: text("actor_id").notNull(), // User who made the change
  action: text("action").notNull(), // e.g., GRANT_PERMISSION, REVOKE_PERMISSION, CHANGE_APPROVAL
  entityType: text("entity_type").notNull(), // e.g., Role, ApprovalLevel
  entityId: text("entity_id").notNull(),
  details: text("details"),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  timestamp: text("timestamp").notNull().default(sql`CURRENT_TIMESTAMP`),
  ipAddress: text("ip_address"),
});


export const slas = sqliteTable("slas", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  priorityId: text("priority_id").references(() => ticketPriorities.id),
  responseTimeMinutes: integer("response_time_minutes").notNull(),
  resolutionTimeMinutes: integer("resolution_time_minutes").notNull(),
});


export const ticketComments = sqliteTable("ticket_comments", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  createdBy: text("created_by").notNull().references(() => employees.id),
  comment: text("comment").notNull(),
  isInternal: integer("is_internal", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const ticketWorklogs = sqliteTable("ticket_worklogs", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  employeeId: text("employee_id").notNull().references(() => employees.id),
  timeSpentMinutes: integer("time_spent_minutes").notNull(),
  workDate: text("work_date").notNull(),
  description: text("description").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const ticketAttachments = sqliteTable("ticket_attachments", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  createdBy: text("created_by").notNull().references(() => employees.id),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const ticketTimelines = sqliteTable("ticket_timelines", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  createdBy: text("created_by").notNull().references(() => employees.id),
  action: text("action").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const ticketWatchers = sqliteTable("ticket_watchers", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  employeeId: text("employee_id").notNull().references(() => employees.id),
});

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const ticketTags = sqliteTable("ticket_tags", {
  id: text("id").primaryKey(),
  ticketId: text("ticket_id").notNull().references(() => tickets.id),
  tagId: text("tag_id").notNull().references(() => tags.id),
});



export const ticketCategories = sqliteTable("ticket_categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  code: text("code"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const ticketSubCategories = sqliteTable("ticket_sub_categories", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").references(() => ticketCategories.id),
  name: text("name").notNull(),
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
  createdAt: text("created_at"),
});

export const ticketPriorities = sqliteTable("ticket_priorities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const ticketImpacts = sqliteTable("ticket_impacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const ticketUrgencies = sqliteTable("ticket_urgencies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const ticketStatuses = sqliteTable("ticket_statuses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  isClosed: integer("is_closed", { mode: 'boolean' }).default(false),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const tickets = sqliteTable("tickets", {
  id: text("id").primaryKey(),
  ticketNumber: text("ticket_number").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  statusId: text("status_id").references(() => ticketStatuses.id),
  priorityId: text("priority_id").references(() => ticketPriorities.id),
  impactId: text("impact_id").references(() => ticketImpacts.id),
  urgencyId: text("urgency_id").references(() => ticketUrgencies.id),
  categoryId: text("category_id").references(() => ticketCategories.id),
  subCategoryId: text("sub_category_id").references(() => ticketSubCategories.id),
  customerId: text("customer_id").references(() => customers.id),
  assignedTo: text("assigned_to").references(() => employees.id),
  reportedBy: text("reported_by"),
  assetId: text("asset_id").references(() => assets.id),
  contractId: text("contract_id").references(() => contracts.id),
  slaId: text("sla_id").references(() => slas.id),
  ciId: text("ci_id").references(() => cis.id),
  expectedResolutionDate: text("expected_resolution_date"),
  actualResolutionDate: text("actual_resolution_date"),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
  deletedAt: text("deleted_at"),
  deletedBy: text("deleted_by"),
});
export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  priority: one(ticketPriorities, {
    fields: [tickets.priorityId],
    references: [ticketPriorities.id],
  }),
  status: one(ticketStatuses, {
    fields: [tickets.statusId],
    references: [ticketStatuses.id],
  }),
  impact: one(ticketImpacts, {
    fields: [tickets.impactId],
    references: [ticketImpacts.id],
  }),
  urgency: one(ticketUrgencies, {
    fields: [tickets.urgencyId],
    references: [ticketUrgencies.id],
  }),
  category: one(ticketCategories, {
    fields: [tickets.categoryId],
    references: [ticketCategories.id],
  }),
  subCategory: one(ticketSubCategories, {
    fields: [tickets.subCategoryId],
    references: [ticketSubCategories.id],
  }),
  asset: one(assets, {
    fields: [tickets.assetId],
    references: [assets.id],
  }),
  contract: one(contracts, {
    fields: [tickets.contractId],
    references: [contracts.id],
  }),
  customer: one(customers, {
    fields: [tickets.customerId],
    references: [customers.id],
  }),
  sla: one(slas, {
    fields: [tickets.slaId],
    references: [slas.id],
  }),
  assignedEmployee: one(employees, {
    fields: [tickets.assignedTo],
    references: [employees.id],
  }),
  reportedEmployee: one(employees, {
    fields: [tickets.reportedBy],
    references: [employees.id],
  }),
  comments: many(ticketComments),
  worklogs: many(ticketWorklogs),
  attachments: many(ticketAttachments),
  timelines: many(ticketTimelines),
  watchers: many(ticketWatchers),
  tags: many(ticketTags),
}));

export const ticketCategoriesRelations = relations(
  ticketCategories,
  ({ many }) => ({
    subCategories: many(ticketSubCategories),
    tickets: many(tickets),
  }),
);

export const ticketSubCategoriesRelations = relations(
  ticketSubCategories,
  ({ one, many }) => ({
    category: one(ticketCategories, {
      fields: [ticketSubCategories.categoryId],
      references: [ticketCategories.id],
    }),
    tickets: many(tickets),
  }),
);

export const ticketCommentsRelations = relations(
  ticketComments,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketComments.ticketId],
      references: [tickets.id],
    }),
    createdByEmployee: one(employees, {
      fields: [ticketComments.createdBy],
      references: [employees.id],
    }),
  }),
);

export const ticketWorklogsRelations = relations(
  ticketWorklogs,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketWorklogs.ticketId],
      references: [tickets.id],
    }),
    employee: one(employees, {
      fields: [ticketWorklogs.employeeId],
      references: [employees.id],
    }),
  }),
);

export const ticketAttachmentsRelations = relations(
  ticketAttachments,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketAttachments.ticketId],
      references: [tickets.id],
    }),
    createdByEmployee: one(employees, {
      fields: [ticketAttachments.createdBy],
      references: [employees.id],
    }),
  }),
);

export const ticketTimelinesRelations = relations(
  ticketTimelines,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketTimelines.ticketId],
      references: [tickets.id],
    }),
    createdByEmployee: one(employees, {
      fields: [ticketTimelines.createdBy],
      references: [employees.id],
    }),
  }),
);

export const ticketWatchersRelations = relations(
  ticketWatchers,
  ({ one }) => ({
    ticket: one(tickets, {
      fields: [ticketWatchers.ticketId],
      references: [tickets.id],
    }),
    employee: one(employees, {
      fields: [ticketWatchers.employeeId],
      references: [employees.id],
    }),
  }),
);

export const tagsRelations = relations(tags, ({ many }) => ({
  tickets: many(ticketTags),
}));

export const ticketTagsRelations = relations(ticketTags, ({ one }) => ({
  ticket: one(tickets, {
    fields: [ticketTags.ticketId],
    references: [tickets.id],
  }),
  tag: one(tags, {
    fields: [ticketTags.tagId],
    references: [tags.id],
  }),
}));

export const slasRelations = relations(slas, ({ one, many }) => ({
  priority: one(ticketPriorities, {
    fields: [slas.priorityId],
    references: [ticketPriorities.id],
  }),
  tickets: many(tickets),
}));



export const dataScopesRelations = relations(dataScopes, ({ many }) => ({
  roleDataScopes: many(roleDataScopes),
}));

export const roleDataScopesRelations = relations(roleDataScopes, ({ one }) => ({
  role: one(roles, {
    fields: [roleDataScopes.roleId],
    references: [roles.id],
  }),
  scope: one(dataScopes, {
    fields: [roleDataScopes.scopeId],
    references: [dataScopes.id],
  }),
}));

export const approvalLevelsRelations = relations(approvalLevels, ({ one }) => ({
  role: one(roles, {
    fields: [approvalLevels.roleId],
    references: [roles.id],
  }),
}));

export const auditPermissionsRelations = relations(auditPermissions, ({ one }) => ({
  actor: one(users, {
    fields: [auditPermissions.actorId],
    references: [users.id],
  }),
}));


export const rolesRelations = relations(roles, ({ one, many }) => ({
  group: one(roleGroups, {
    fields: [roles.groupId],
    references: [roleGroups.id],
  }),
  rolePermissions: many(rolePermissions),
  userRoles: many(userRoles),
  roleDataScopes: many(roleDataScopes),
  menuPermissions: many(menuPermissions),
  approvalLevels: many(approvalLevels),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.roleId],
      references: [roles.id],
    }),
    permission: one(permissions, {
      fields: [rolePermissions.permissionId],
      references: [permissions.id],
    }),
  }),
);

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
}));

export const menuPermissionsRelations = relations(
  menuPermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [menuPermissions.roleId],
      references: [roles.id],
    }),
  }),
);




export const activities = sqliteTable("activities", {
  id: text("id").primaryKey(),
  performedById: text("performed_by_id").references(() => employees.id),
  date: text("date").notNull(),
  action: text("action").notNull(),
  description: text("description"),
  type: text("type"),
  referenceId: text("reference_id"),
  referenceType: text("reference_type"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});


export const contracts = sqliteTable("contracts", {
  id: text("id").primaryKey(),
  contractNumber: text("contract_number"),
  customerId: text("customer_id").references(() => customers.id),
  contractType: text("contract_type"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  status: text("status"),
  description: text("description"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
  createdAt: text("created_at"),
  updatedAt: text("updated_at"),
});

export const contractServices = sqliteTable("contract_services", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractSlas = sqliteTable("contract_slas", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractCoverages = sqliteTable("contract_coverages", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractDevices = sqliteTable("contract_devices", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractBillings = sqliteTable("contract_billings", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractRenewals = sqliteTable("contract_renewals", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const contractApprovals = sqliteTable("contract_approvals", {
  id: text("id").primaryKey(),
  contractId: text("contract_id").references(() => contracts.id),
  name: text("name"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
});

export const jobs = sqliteTable("jobs", { id: text("id").primaryKey(), name: text("name").notNull() });

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  companyName: text("company_name"),
  pic: text("pic"),
  email: text("email"),
  phone: text("phone"),
  productInterest: text("product_interest"),
  source: text("source"),
  status: text("status"),
  score: integer("score"),
  ownerId: text("owner_id").references(() => employees.id),
  estimatedValue: real("estimated_value"),
  isDeleted: integer("is_deleted", { mode: 'boolean' }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`)
});

export const referenceGroups = sqliteTable("reference_groups", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  isSystem: integer("is_system", { mode: 'boolean' }).default(false),
  sortOrder: integer("sort_order").default(0),
});

export const referenceValues = sqliteTable("reference_values", {
  id: text("id").primaryKey(),
  groupId: text("group_id").notNull().references(() => referenceGroups.id),
  code: text("code").notNull(),
  value: text("value").notNull(),
  description: text("description"),
  isActive: integer("is_active", { mode: 'boolean' }).default(true),
  sortOrder: integer("sort_order").default(0),
});


export const journalEntries = sqliteTable("journal_entries", {
  id: text("id").primaryKey(),
  journalId: text("journal_id").notNull(),
  entryNumber: text("entry_number").notNull(),
  entryDate: text("entry_date").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  version: integer("version").notNull().default(1)
});

export const journalLines = sqliteTable("journal_lines", {
  id: text("id").primaryKey(),
  journalEntryId: text("journal_entry_id").notNull().references(() => journalEntries.id),
  accountId: text("account_id").notNull(),
  entryType: text("entry_type").notNull(),
  amount: real("amount").notNull(),
  currencyId: text("currency_id").notNull(),
  description: text("description")
});

export const ledgerAccounts = sqliteTable("ledger_accounts", {
  id: text("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  accountType: text("account_type").notNull(),
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  version: integer("version").notNull().default(1)
});

export const ledgerPostings = sqliteTable("ledger_postings", {
  id: text("id").primaryKey(),
  ledgerId: text("ledger_id").notNull(),
  accountId: text("account_id").notNull().references(() => ledgerAccounts.id),
  journalEntryId: text("journal_entry_id").notNull(),
  journalLineId: text("journal_line_id").notNull(),
  entryType: text("entry_type").notNull(),
  amount: real("amount").notNull(),
  currencyId: text("currency_id").notNull(),
  postingDate: text("posting_date").notNull(),
  fiscalPeriodId: text("fiscal_period_id").notNull()
});

export const apCreditNotes = sqliteTable("ap_credit_notes", {
  id: text("id").primaryKey(),
  vendorId: text("vendor_id").notNull().references(() => vendors.id),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  amount: real("amount").notNull(),
  creditDate: text("credit_date").notNull(),
  currencyId: text("currency_id").notNull(),
  referenceNumber: text("reference_number"),
  status: text("status").notNull(),
  creditAccountId: text("credit_account_id").notNull(),
  version: integer("version").notNull().default(1)
});

export const arCreditNotes = sqliteTable("ar_credit_notes", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  amount: real("amount").notNull(),
  creditDate: text("credit_date").notNull(),
  currencyId: text("currency_id").notNull(),
  referenceNumber: text("reference_number"),
  status: text("status").notNull(),
  creditAccountId: text("credit_account_id").notNull(),
  version: integer("version").notNull().default(1)
});

export const apPayments = sqliteTable("ap_payments", {
  id: text("id").primaryKey(),
  vendorId: text("vendor_id").notNull().references(() => vendors.id),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  amount: real("amount").notNull(),
  paymentDate: text("payment_date").notNull(),
  currencyId: text("currency_id").notNull(),
  referenceNumber: text("reference_number"),
  status: text("status").notNull(),
  version: integer("version").notNull().default(1)
});

export const arReceipts = sqliteTable("ar_receipts", {
  id: text("id").primaryKey(),
  customerId: text("customer_id").notNull().references(() => customers.id),
  invoiceId: text("invoice_id").notNull().references(() => invoices.id),
  amount: real("amount").notNull(),
  receiptDate: text("receipt_date").notNull(),
  currencyId: text("currency_id").notNull(),
  referenceNumber: text("reference_number"),
  status: text("status").notNull(),
  version: integer("version").notNull().default(1)
});
