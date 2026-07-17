import { Router } from "express";
import { employmentApplicationService, employmentQueryService } from "../services/employment/EmploymentFactory.js";
import { assignmentApplicationService, assignmentQueryService } from "../services/employment/EmploymentFactory.js";
import { z } from "zod";

const router = Router();

const createEmploymentSchema = z.object({
  employeeNumber: z.string().min(1),
  fullName: z.string().min(1),
  organizationId: z.string().nullable().optional(),
  employmentType: z.enum(["PERMANENT", "CONTRACT", "PROBATION", "INTERNSHIP"]),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "TERMINATED"]),
  joinDate: z.string().min(1)
});

const updateEmploymentSchema = createEmploymentSchema.partial();

// Authentication / Authorization Middleware mock for Enterprise Standard
const requireAuth = (req: any, res: any, next: any) => {
  req.user = { username: "system_admin" }; // Mocked actor
  next();
};

router.use(requireAuth);

router.post("/", async (req: any, res: any) => {
  try {
    const data = createEmploymentSchema.parse(req.body);
    const result = await employmentApplicationService.createEmployment(data, req.user.username);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put("/:id", async (req: any, res: any) => {
  try {
    const data = updateEmploymentSchema.parse(req.body);
    const result = await employmentApplicationService.updateEmployment({ id: req.params.id, ...data }, req.user.username);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/:id/terminate", async (req: any, res: any) => {
  try {
    const { terminationDate } = req.body;
    await employmentApplicationService.terminateEmployment(req.params.id, terminationDate, req.user.username);
    res.json({ success: true, message: "Employment terminated successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/search", async (req: any, res: any) => {
  try {
    const result = await employmentQueryService.search(req.query);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req: any, res: any) => {
  try {
    const result = await employmentQueryService.getById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;


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
