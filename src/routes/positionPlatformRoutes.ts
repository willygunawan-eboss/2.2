import { Router } from "express";
import { z } from "zod";
import { positionApplicationService, positionQueryService } from "../services/position/PositionFactory.js";

const router = Router();

// Mock authentication middleware
router.use((req: any, res: any, next: any) => {
  req.user = { id: "sysadmin", username: "System Admin" };
  next();
});

const createPositionSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  companyId: z.string().nullable().optional(),
  jobId: z.string().nullable().optional(),
  employmentType: z.string().nullable().optional(),
  effectiveDate: z.string().min(1)
});

const updatePositionSchema = z.object({
  name: z.string().min(1),
  jobId: z.string().nullable().optional(),
  employmentType: z.string().nullable().optional(),
});

const changeStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"])
});

router.post("/", async (req: any, res: any) => {
  try {
    const data = createPositionSchema.parse(req.body);
    const result = await positionApplicationService.createPosition(data, req.user.username);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put("/:id", async (req: any, res: any) => {
  try {
    const data = updatePositionSchema.parse(req.body);
    const result = await positionApplicationService.updatePosition(req.params.id, data, req.user.username);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put("/:id/status", async (req: any, res: any) => {
  try {
    const data = changeStatusSchema.parse(req.body);
    await positionApplicationService.changeStatus(req.params.id, data.status, req.user.username);
    res.json({ success: true, message: `Position status changed to ${data.status}` });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/:id", async (req: any, res: any) => {
  try {
    await positionApplicationService.deletePosition(req.params.id, req.user.username);
    res.json({ success: true, message: "Position deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/search", async (req: any, res: any) => {
  try {
    const result = await positionQueryService.search(req.query);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/:id", async (req: any, res: any) => {
  try {
    const result = await positionQueryService.getById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
});

export default router;
