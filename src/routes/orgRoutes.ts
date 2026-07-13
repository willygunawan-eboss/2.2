import { BranchService } from "../services/BranchService.js";
import { DivisionService } from "../services/DivisionService.js";
import { DepartmentService } from "../services/DepartmentService.js";
import { SectionService } from "../services/SectionService.js";
import { TeamService } from "../services/TeamService.js";
import { JobGradeService } from "../services/JobGradeService.js";
import { PositionService } from "../services/PositionService.js";
import { CompanyService } from "../services/CompanyService.js";
import { OrganizationService } from "../services/OrganizationService.js";
import { OrganizationRegistryService } from "../services/OrganizationRegistryService.js";
import { z } from "zod";
import { Router } from "express";
import { db } from "../db/index.js";
import * as schema from "../db/schema.js";
import { eq, desc, asc, like, and, isNull, or } from "drizzle-orm";
import {
  companySchema, branchSchema, divisionSchema,
  departmentSchema, sectionSchema, teamSchema, 
  jobGradeSchema, positionSchema,
  orgEmployeeSchema
} from "../validations.js";
import crypto from "crypto";

const router = Router();

// Helper for soft delete
const notDeleted = (table: any) => isNull(table.deletedAt);


// Generic CRUD Generator
const buildCrud = (path: string, table: any, validationSchema: any, searchFields: any[]) => {
  // List
  router.get(`/${path}`, async (req, res) => {
    try {
      const result = await OrganizationService.list(table, req.query, searchFields);
      OrganizationRegistryService.invalidateCache();
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Get by ID
  router.get(`/${path}/:id`, async (req, res) => {
    try {
      const data = await OrganizationService.getById(table, req.params.id);
      if (!data) return res.status(404).json({ success: false, message: "Not found" });
      OrganizationRegistryService.invalidateCache();
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

    
  // Create
  router.post(`/${path}`, async (req, res) => {
    try {
      // Run readiness check
      const ready = await OrganizationService.checkReadiness(path);
      if (!ready.success) {
        return res.status(400).json({ success: false, error: [{ message: ready.message }] });
      }

      Object.keys(req.body).forEach(k => {
        if (req.body[k] === "") req.body[k] = null;
      });
      const validatedData = validationSchema.parse(req.body);
      // @ts-ignore
      const result = await OrganizationService.create(table, validatedData, req.user?.username);
      OrganizationRegistryService.invalidateCache();
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ success: false, error: error.errors });
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Update
  router.put(`/${path}/:id`, async (req, res) => {
    try {
      Object.keys(req.body).forEach(k => {
        if (req.body[k] === "") req.body[k] = null;
      });
      const validatedData = validationSchema.partial().parse(req.body);
      // @ts-ignore
      const updated = await OrganizationService.update(table, req.params.id, validatedData, req.user?.username);
      if (!updated) return res.status(404).json({ success: false, message: "Not found" });
      OrganizationRegistryService.invalidateCache();
      res.json({ success: true, message: "Updated successfully" });
    } catch (error: any) {
      if (error.errors) return res.status(400).json({ success: false, error: error.errors });
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Delete
  router.delete(`/${path}/:id`, async (req, res) => {
    try {
      // @ts-ignore
      const deleted = await OrganizationService.delete(table, req.params.id, req.user?.username);
      if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
      OrganizationRegistryService.invalidateCache();
      res.json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
};


import { requirePermission } from "../middleware/rbacMiddleware.js";

// Custom Company Endpoints
router.get("/companies", requirePermission('company', 'read'), async (req, res) => {
  try {
    const result = await CompanyService.list(req.query);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/companies/:id", requirePermission('company', 'read'), async (req, res) => {
  try {
    const data = await CompanyService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/companies/:id/audits", requirePermission('company', 'read'), async (req, res) => {
  try {
    const data = await CompanyService.getAudits(req.params.id);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/companies", requirePermission('company', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = companySchema.parse(req.body);
    // @ts-ignore
    const result = await CompanyService.create(validatedData, req.user?.username);
    OrganizationRegistryService.invalidateCache();
      res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/companies/:id", requirePermission('company', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = companySchema.partial().parse(req.body);
    // @ts-ignore
    const updated = await CompanyService.update(req.params.id, validatedData, req.user?.username);
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Updated successfully" });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/companies/:id", requirePermission('company', 'delete'), async (req, res) => {
  try {
    // @ts-ignore
    const deleted = await CompanyService.delete(req.params.id, req.user?.username);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/companies/:id/restore", requirePermission('company', 'write'), async (req, res) => {
  try {
    // @ts-ignore
    const restored = await CompanyService.restore(req.params.id, req.user?.username);
    if (!restored) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Restored successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// buildCrud("companies", schema.companies, companySchema, [schema.companies.code, schema.companies.name]);
// Custom Branch Endpoints
router.get("/branches", requirePermission('branch', 'read'), async (req, res) => {
  try {
    const result = await BranchService.list(req.query);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/branches/:id", requirePermission('branch', 'read'), async (req, res) => {
  try {
    const data = await BranchService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/branches/:id/audits", requirePermission('branch', 'read'), async (req, res) => {
  try {
    const data = await BranchService.getAudits(req.params.id);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/branches", requirePermission('branch', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = branchSchema.parse(req.body);
    // @ts-ignore
    const result = await BranchService.create(validatedData, req.user?.username);
    OrganizationRegistryService.invalidateCache();
      res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/branches/:id", requirePermission('branch', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = branchSchema.partial().parse(req.body);
    // @ts-ignore
    const updated = await BranchService.update(req.params.id, validatedData, req.user?.username);
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Updated successfully" });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/branches/:id", requirePermission('branch', 'delete'), async (req, res) => {
  try {
    // @ts-ignore
    const deleted = await BranchService.delete(req.params.id, req.user?.username);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/branches/:id/restore", requirePermission('branch', 'write'), async (req, res) => {
  try {
    // @ts-ignore
    const restored = await BranchService.restore(req.params.id, req.user?.username);
    if (!restored) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Restored successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// buildCrud("branches", schema.branches, branchSchema, [schema.branches.code, schema.branches.name]);

// Custom Division Endpoints
router.get("/divisions", requirePermission('division', 'read'), async (req, res) => {
  try {
    const result = await DivisionService.list(req.query);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/divisions/:id", requirePermission('division', 'read'), async (req, res) => {
  try {
    const data = await DivisionService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/divisions/:id/audits", requirePermission('division', 'read'), async (req, res) => {
  try {
    const data = await DivisionService.getAudits(req.params.id);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/divisions", requirePermission('division', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = divisionSchema.parse(req.body);
    // @ts-ignore
    const result = await DivisionService.create(validatedData, req.user?.username);
    OrganizationRegistryService.invalidateCache();
      res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/divisions/:id", requirePermission('division', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = divisionSchema.partial().parse(req.body);
    // @ts-ignore
    const updated = await DivisionService.update(req.params.id, validatedData, req.user?.username);
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Updated successfully" });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/divisions/:id", requirePermission('division', 'delete'), async (req, res) => {
  try {
    // @ts-ignore
    const deleted = await DivisionService.delete(req.params.id, req.user?.username);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/divisions/:id/restore", requirePermission('division', 'write'), async (req, res) => {
  try {
    // @ts-ignore
    const restored = await DivisionService.restore(req.params.id, req.user?.username);
    if (!restored) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Restored successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Custom Department Endpoints
router.get("/departments", requirePermission('department', 'read'), async (req, res) => {
  try {
    const result = await DepartmentService.list(req.query);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/departments/:id", requirePermission('department', 'read'), async (req, res) => {
  try {
    const data = await DepartmentService.getById(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/departments/:id/audits", requirePermission('department', 'read'), async (req, res) => {
  try {
    const data = await DepartmentService.getAudits(req.params.id);
    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/departments", requirePermission('department', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = departmentSchema.parse(req.body);
    // @ts-ignore
    const result = await DepartmentService.create(validatedData, req.user?.username);
    OrganizationRegistryService.invalidateCache();
      res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/departments/:id", requirePermission('department', 'write'), async (req, res) => {
  try {
    Object.keys(req.body).forEach(k => {
      if (req.body[k] === "") req.body[k] = null;
    });
    const validatedData = departmentSchema.partial().parse(req.body);
    // @ts-ignore
    const updated = await DepartmentService.update(req.params.id, validatedData, req.user?.username);
    if (!updated) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Updated successfully" });
  } catch (error: any) {
    if (error.errors) return res.status(400).json({ success: false, error: error.errors });
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete("/departments/:id", requirePermission('department', 'delete'), async (req, res) => {
  try {
    // @ts-ignore
    const deleted = await DepartmentService.delete(req.params.id, req.user?.username);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post("/departments/:id/restore", requirePermission('department', 'write'), async (req, res) => {
  try {
    // @ts-ignore
    const restored = await DepartmentService.restore(req.params.id, req.user?.username);
    if (!restored) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Restored successfully" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});


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
    OrganizationRegistryService.invalidateCache();
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
    OrganizationRegistryService.invalidateCache();
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

buildCrud("employees", schema.employees, orgEmployeeSchema, [schema.employees.employeeNumber, schema.employees.name, schema.employees.email]);


// References
router.get('/references/all', async (req, res) => {
  try {
    const data = await OrganizationService.getReferences(schema);
    res.json({
      success: true,
      data
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});


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
    OrganizationRegistryService.invalidateCache();
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
    OrganizationRegistryService.invalidateCache();
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

export default router;
