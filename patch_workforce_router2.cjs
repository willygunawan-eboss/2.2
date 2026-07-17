const fs = require('fs');
const file = 'src/services/workforce/presentation/WorkforceRouter.ts';
let code = fs.readFileSync(file, 'utf8');

const imports = `
import { PromoteEmployeeUseCase } from '../application/PromoteEmployeeUseCase';
import { AuditServiceImpl } from '../../employment/infrastructure/AuditServiceImpl';
import { TimelineServiceImpl } from '../../employment/infrastructure/TimelineServiceImpl';
`;

code = code.replace(
  "import { TransferEmployeeUseCase } from '../application/TransferEmployeeUseCase';",
  "import { TransferEmployeeUseCase } from '../application/TransferEmployeeUseCase';" + imports
);

const serviceInit = `
const auditService = new AuditServiceImpl();
const timelineService = new TimelineServiceImpl();
const promoteEmployeeUseCase = new PromoteEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);
`;

code = code.replace(
  "const transferEmployeeUseCase = new TransferEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService);",
  "const transferEmployeeUseCase = new TransferEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService);" + serviceInit
);

const promoteSchema = `
const PromoteEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee Number is required"),
  companyId: z.string().min(1, "Company is required"),
  newOrganizationId: z.string().min(1, "New Organization is required"),
  newPositionId: z.string().min(1, "New Position is required"),
  newJobGradeId: z.string().optional(),
  effectiveDate: z.string().min(1, "Effective Date is required"),
  reason: z.string().min(1, "Reason is required"),
});

router.post('/promote', async (req, res) => {
  try {
    const actor = (req as any).user?.id || 'SYSTEM';
    const validatedData = PromoteEmployeeSchema.parse(req.body);
    const result = await promoteEmployeeUseCase.execute({
      ...validatedData,
      actor
    });
    res.status(200).json({
      status: "success",
      message: "Employee promoted successfully",
      data: result
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    }
    if (error instanceof WorkforceDomainError) {
      return res.status(400).json({ status: "error", message: error.message, code: error.code });
    }
    res.status(400).json({ status: "error", message: error.message || "Failed to promote employee" });
  }
});
`;

code = code.replace(
  "export default router;",
  promoteSchema + "\nexport default router;"
);

fs.writeFileSync(file, code);
