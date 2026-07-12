const fs = require('fs');
let content = fs.readFileSync('src/routes/orgRoutes.ts', 'utf-8');

// Add imports
if (!content.includes('JobGradeService')) {
  content = content.replace('import { TeamService } from "../services/TeamService.js";', 'import { TeamService } from "../services/TeamService.js";\nimport { JobGradeService } from "../services/JobGradeService.js";\nimport { PositionService } from "../services/PositionService.js";');
}

// Remove old buildCrud for job-grades and positions if they exist
content = content.replace(/buildCrud\("job-grades",.*?\);\n/g, '');
content = content.replace(/buildCrud\("positions",.*?\);\n/g, '');

const customRoutes = `
// Job Grades Custom Routes
router.get("/job-grades", async (req, res) => {
  try {
    const result = await JobGradeService.list({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string || '',
      showDeleted: req.query.showDeleted === 'true'
    });
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/job-grades/:id", async (req, res) => {
  try {
    const data = await JobGradeService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/job-grades", async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = jobGradeSchema.parse(req.body);
    // @ts-ignore
    const result = await JobGradeService.create(validatedData, req.user?.username);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/job-grades/:id", async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = jobGradeSchema.partial().parse(req.body);
    // @ts-ignore
    const result = await JobGradeService.update(req.params.id, validatedData, req.user?.username);
    res.json({ success: true, data: result });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/job-grades/:id", async (req, res) => {
  try {
    // @ts-ignore
    await JobGradeService.delete(req.params.id, req.user?.username);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/job-grades/:id/restore", async (req, res) => {
  try {
    // @ts-ignore
    await JobGradeService.restore(req.params.id, req.user?.username);
    res.json({ success: true, message: "Restored successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Positions Custom Routes
router.get("/positions", async (req, res) => {
  try {
    const result = await PositionService.list({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string || '',
      showDeleted: req.query.showDeleted === 'true'
    });
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/positions/:id", async (req, res) => {
  try {
    const data = await PositionService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/positions", async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = positionSchema.parse(req.body);
    // @ts-ignore
    const result = await PositionService.create(validatedData, req.user?.username);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/positions/:id", async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = positionSchema.partial().parse(req.body);
    // @ts-ignore
    const result = await PositionService.update(req.params.id, validatedData, req.user?.username);
    res.json({ success: true, data: result });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/positions/:id", async (req, res) => {
  try {
    // @ts-ignore
    await PositionService.delete(req.params.id, req.user?.username);
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/positions/:id/restore", async (req, res) => {
  try {
    // @ts-ignore
    await PositionService.restore(req.params.id, req.user?.username);
    res.json({ success: true, message: "Restored successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

`;

content = content.replace('export default router;', customRoutes + 'export default router;');

fs.writeFileSync('src/routes/orgRoutes.ts', content);
