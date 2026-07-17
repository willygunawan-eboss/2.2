const fs = require('fs');
const file = 'src/services/workforce/presentation/WorkforceRouter.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `import { PromoteEmployeeUseCase } from '../application/PromoteEmployeeUseCase';`,
  `import { PromoteEmployeeUseCase } from '../application/PromoteEmployeeUseCase';\nimport { TerminateEmployeeUseCase } from '../application/TerminateEmployeeUseCase';\nimport { MutateEmployeeUseCase } from '../application/MutateEmployeeUseCase';`
);

code = code.replace(
  `const transferEmployeeUseCase = new TransferEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);`,
  `const transferEmployeeUseCase = new TransferEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);\nconst mutateEmployeeUseCase = new MutateEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);\nconst terminateEmployeeUseCase = new TerminateEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);`
);

code = code.replace(
  `export default router;`,
  `
const MutateEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee Number is required"),
  companyId: z.string().min(1, "Company is required"),
  newOrganizationId: z.string().min(1, "New Organization is required"),
  newPositionId: z.string().min(1, "New Position is required"),
  effectiveDate: z.string().min(1, "Effective Date is required"),
  reason: z.string().min(1, "Reason is required"),
});

router.post('/mutate', async (req, res) => {
  try {
    const actor = (req as any).user?.id || 'SYSTEM';
    const validatedData = MutateEmployeeSchema.parse(req.body);
    const result = await mutateEmployeeUseCase.execute({
      ...validatedData,
      actor
    });
    res.status(200).json({ status: "success", message: "Employee mutated successfully", data: result });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    if (error instanceof WorkforceDomainError) return res.status(400).json({ status: "error", message: error.message, code: error.code });
    res.status(400).json({ status: "error", message: error.message || "Failed to mutate employee" });
  }
});

const TerminateEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee Number is required"),
  effectiveDate: z.string().min(1, "Effective Date is required"),
  reason: z.string().min(1, "Reason is required"),
  terminationType: z.string().min(1, "Termination Type is required"),
});

router.post('/terminate', async (req, res) => {
  try {
    const actor = (req as any).user?.id || 'SYSTEM';
    const validatedData = TerminateEmployeeSchema.parse(req.body);
    const result = await terminateEmployeeUseCase.execute({
      ...validatedData,
      actor
    });
    res.status(200).json({ status: "success", message: "Employee terminated successfully", data: result });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    if (error instanceof WorkforceDomainError) return res.status(400).json({ status: "error", message: error.message, code: error.code });
    res.status(400).json({ status: "error", message: error.message || "Failed to terminate employee" });
  }
});

export default router;
`
);

fs.writeFileSync(file, code);
