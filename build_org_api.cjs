const fs = require('fs');
const path = require('path');

const orgApi = `
import { Router } from "express";
import { OrganizationBusinessEngine } from "../services/organization/OrganizationEngine.js";
import { z } from "zod";
import * as schema from "../db/schema.js";

const router = Router();

const createOrgSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["COMPANY", "BRANCH", "DIVISION", "DEPARTMENT", "SECTION", "TEAM", "POSITION"]),
  parentId: z.string().nullable().optional()
});

const updateOrgSchema = createOrgSchema.partial();

// Authentication / Authorization Middleware mock for Enterprise Standard
const requireAuth = (req: any, res: any, next: any) => {
  req.user = { username: "system_admin" }; // Mocked actor
  next();
};

router.use(requireAuth);

router.post("/", async (req: any, res: any) => {
  try {
    const data = createOrgSchema.parse(req.body);
    const result = await OrganizationBusinessEngine.createOrganization(data, req.user.username);
    res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put("/:id", async (req: any, res: any) => {
  try {
    const data = updateOrgSchema.parse(req.body);
    const result = await OrganizationBusinessEngine.updateOrganization(req.params.id, data, req.user.username);
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete("/:id", async (req: any, res: any) => {
  try {
    await OrganizationBusinessEngine.deleteOrganization(req.params.id, req.user.username);
    res.json({ success: true, message: "Organization deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/:id/restore", async (req: any, res: any) => {
  try {
    await OrganizationBusinessEngine.restoreOrganization(req.params.id, req.user.username);
    res.json({ success: true, message: "Organization restored successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get("/tree", async (req: any, res: any) => {
  try {
    const tree = await OrganizationBusinessEngine.getTree();
    res.json({ success: true, data: tree });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/search", async (req: any, res: any) => {
  try {
    const result = await OrganizationBusinessEngine.search(req.query);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
`;

fs.writeFileSync('src/routes/organizationPlatformRoutes.ts', orgApi);
console.log("Created organizationPlatformRoutes.ts");

// Register it in server.ts
let serverFile = fs.readFileSync('server.ts', 'utf8');
if (!serverFile.includes('organizationPlatformRoutes')) {
  serverFile = serverFile.replace('import orgRoutes from "./src/routes/orgRoutes.js";', 'import orgRoutes from "./src/routes/orgRoutes.js";\nimport organizationPlatformRoutes from "./src/routes/organizationPlatformRoutes.js";');
  serverFile = serverFile.replace('app.use("/api/org", orgRoutes);', 'app.use("/api/org", orgRoutes);\napp.use("/api/v2/org", organizationPlatformRoutes);');
  fs.writeFileSync('server.ts', serverFile);
  console.log("Registered organizationPlatformRoutes in server.ts");
}
