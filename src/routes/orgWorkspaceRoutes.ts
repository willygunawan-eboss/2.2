import { Router } from "express";
import { WorkspaceService } from "../services/WorkspaceService.js";

const router = Router();

router.get("/summary", async (req, res) => {
  try {
    const data = await WorkspaceService.getSummary();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/readiness", async (req, res) => {
  try {
    const data = await WorkspaceService.getReadiness();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/insight", async (req, res) => {
  try {
    const data = await WorkspaceService.getInsight();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/tree", async (req, res) => {
  try {
    const data = await WorkspaceService.getTree();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/hierarchy", async (req, res) => {
  try {
    const data = await WorkspaceService.getHierarchy();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
