const fs = require('fs');
let content = fs.readFileSync('src/validations.ts', 'utf-8');

const jobGradesRegex = /export const jobGradeSchema = z\.object\(\{[\s\S]*?\}\);/;
const jobGradesReplacement = `export const jobGradeSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  level: z.number().int().min(1, "Level is required"),
  sequence: z.number().int().optional().nullable(),
  minimumSalary: z.number().optional().nullable(),
  maximumSalary: z.number().optional().nullable(),
  currency: z.string().optional().nullable().default('IDR'),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});`;

const positionsRegex = /export const positionSchema = z\.object\(\{[\s\S]*?\}\);/;
const positionsReplacement = `export const positionSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  companyId: z.string().min(1, "Company is required"),
  branchId: z.string().min(1, "Branch is required"),
  divisionId: z.string().min(1, "Division is required"),
  departmentId: z.string().min(1, "Department is required"),
  sectionId: z.string().optional().nullable(),
  teamId: z.string().optional().nullable(),
  jobGradeId: z.string().min(1, "Job Grade is required"),
  parentPositionId: z.string().optional().nullable(),
  reportsToPositionId: z.string().optional().nullable(),
  level: z.number().int().optional().nullable(),
  employmentTypeId: z.string().optional().nullable(),
  approvalLevel: z.number().int().optional().nullable(),
  defaultShiftId: z.string().optional().nullable(),
  costCenterId: z.string().optional().nullable(),
  canApproveLeave: z.boolean().optional().default(false),
  canApprovePurchase: z.boolean().optional().default(false),
  canApproveExpense: z.boolean().optional().default(false),
  canApproveProject: z.boolean().optional().default(false),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});`;

content = content.replace(jobGradesRegex, jobGradesReplacement);
content = content.replace(positionsRegex, positionsReplacement);

fs.writeFileSync('src/validations.ts', content);
