import { Router } from "express";
import { requirePermission } from "../middleware/rbacMiddleware.js";
import { OrganizationRegistryService } from "../services/OrganizationRegistryService.js";

const router = Router();

router.get("/registry", requirePermission("company", "read"), async (req, res) => {
  try {
    const data = await OrganizationRegistryService.getRegistry();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/cache/refresh", requirePermission("company", "write"), async (req, res) => {
  try {
    OrganizationRegistryService.invalidateCache();
    const data = await OrganizationRegistryService.getRegistry(true);
    res.json({ success: true, message: 'Cache refreshed', data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/health", requirePermission("company", "read"), async (req, res) => {
  try {
    const data = await OrganizationRegistryService.getHealth();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/integrity", requirePermission("company", "read"), async (req, res) => {
  try {
    const data = await OrganizationRegistryService.getHealth();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/validate", requirePermission("company", "read"), async (req, res) => {
  try {
    const data = await OrganizationRegistryService.getHealth();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/statistics", requirePermission("company", "read"), async (req, res) => {
  try {
    const registry = await OrganizationRegistryService.getRegistry();
    res.json({
       companies: registry.companies.length,
       branches: registry.branches.length,
       divisions: registry.divisions.length,
       departments: registry.departments.length,
       sections: registry.sections.length,
       teams: registry.teams.length,
       positions: registry.positions.length,
       jobGrades: registry.jobGrades.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
