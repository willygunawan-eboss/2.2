const fs = require('fs');
let content = fs.readFileSync('src/routes/employmentPlatformRoutes.ts', 'utf8');

const imports = `import { assignmentApplicationService, assignmentQueryService } from "../services/employment/EmploymentFactory.js";`;

content = content.replace(
  'import { employmentApplicationService, employmentQueryService } from "../services/employment/EmploymentFactory.js";',
  'import { employmentApplicationService, employmentQueryService } from "../services/employment/EmploymentFactory.js";\n' + imports
);

const assignmentRoutes = `

const createAssignmentSchema = z.object({
  employmentId: z.string().min(1),
  organizationId: z.string().min(1),
  positionId: z.string().min(1),
  managerId: z.string().nullable().optional(),
  supervisorId: z.string().nullable().optional(),
  effectiveDate: z.string().min(1)
});

const terminateAssignmentSchema = z.object({
  endDate: z.string().min(1)
});

router.post("/assignments", async (req: any, res: any) => {
  try {
    const data = createAssignmentSchema.parse(req.body);
    const result = await assignmentApplicationService.createAssignment(data, req.user.username);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/assignments/:id/terminate", async (req: any, res: any) => {
  try {
    const data = terminateAssignmentSchema.parse(req.body);
    await assignmentApplicationService.terminateAssignment(req.params.id, data, req.user.username);
    res.json({ success: true, message: "Assignment terminated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/assignments/search", async (req: any, res: any) => {
  try {
    const result = await assignmentQueryService.search(req.query);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:employmentId/assignments/active", async (req: any, res: any) => {
  try {
    const result = await assignmentQueryService.getActiveByEmploymentId(req.params.employmentId);
    if (!result) {
      return res.status(404).json({ success: false, message: "No active assignment found" });
    }
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/:employmentId/assignments", async (req: any, res: any) => {
  try {
    const result = await assignmentQueryService.getHistoryByEmploymentId(req.params.employmentId);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});
`;

content += assignmentRoutes;

fs.writeFileSync('src/routes/employmentPlatformRoutes.ts', content);
