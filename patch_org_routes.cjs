const fs = require('fs');
let code = fs.readFileSync('src/routes/orgRoutes.ts', 'utf-8');

const importLines = `
import { SectionService } from "../services/SectionService.js";
import { TeamService } from "../services/TeamService.js";
`;
code = code.replace(/import { CompanyService } from "\.\.\/services\/CompanyService\.js";/, importLines.trim() + '\nimport { CompanyService } from "../services/CompanyService.js";');

const sectionTeamRoutes = `
// Custom Section Endpoints
router.get("/sections", requirePermission('section', 'read'), async (req, res) => {
  try {
    const result = await SectionService.list(req.query);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/sections/:id", requirePermission('section', 'read'), async (req, res) => {
  try {
    const data = await SectionService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/sections/:id/audits", requirePermission('section', 'read'), async (req, res) => {
  try {
    const data = await SectionService.getAudits(req.params.id);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/sections", requirePermission('section', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = sectionSchema.parse(req.body);
    // @ts-ignore
    const result = await SectionService.create(validatedData, req.user?.username);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/sections/:id", requirePermission('section', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = sectionSchema.partial().parse(req.body);
    // @ts-ignore
    const updated = await SectionService.update(req.params.id, validatedData, req.user?.username);
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Updated successfully" });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/sections/:id", requirePermission('section', 'delete'), async (req, res) => {
  try {
    // @ts-ignore
    const deleted = await SectionService.delete(req.params.id, req.user?.username);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/sections/:id/restore", requirePermission('section', 'write'), async (req, res) => {
  try {
    // @ts-ignore
    const restored = await SectionService.restore(req.params.id, req.user?.username);
    if (!restored) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Restored successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Custom Team Endpoints
router.get("/teams", requirePermission('team', 'read'), async (req, res) => {
  try {
    const result = await TeamService.list(req.query);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/teams/:id", requirePermission('team', 'read'), async (req, res) => {
  try {
    const data = await TeamService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/teams/:id/audits", requirePermission('team', 'read'), async (req, res) => {
  try {
    const data = await TeamService.getAudits(req.params.id);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/teams", requirePermission('team', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = teamSchema.parse(req.body);
    // @ts-ignore
    const result = await TeamService.create(validatedData, req.user?.username);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/teams/:id", requirePermission('team', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = teamSchema.partial().parse(req.body);
    // @ts-ignore
    const updated = await TeamService.update(req.params.id, validatedData, req.user?.username);
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Updated successfully" });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/teams/:id", requirePermission('team', 'delete'), async (req, res) => {
  try {
    // @ts-ignore
    const deleted = await TeamService.delete(req.params.id, req.user?.username);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/teams/:id/restore", requirePermission('team', 'write'), async (req, res) => {
  try {
    // @ts-ignore
    const restored = await TeamService.restore(req.params.id, req.user?.username);
    if (!restored) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Restored successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});
`;

code = code.replace(/buildCrud\("sections", schema\.sections, sectionSchema, \[schema\.sections\.code, schema\.sections\.name\]\);\nbuildCrud\("teams", schema\.teams, teamSchema, \[schema\.teams\.code, schema\.teams\.name\]\);/, sectionTeamRoutes);

fs.writeFileSync('src/routes/orgRoutes.ts', code);
