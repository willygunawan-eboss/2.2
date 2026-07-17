import { Router } from 'express';
import { db } from '../db';
import * as schema from '../db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import crypto from 'crypto';
import { EmployeeService } from '../services/EmployeeService';

const router = Router();
const randomUUID = () => crypto.randomUUID();
const employeeService = new EmployeeService();

// ==========================================
// Legacy / Used by Workspace
// ==========================================
router.get('/:id/workspace', async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await db.query.employees.findFirst({
      where: eq(schema.employees.id, id),
      with: {
        contracts: { orderBy: [desc(schema.employeeContracts.startDate)] },
        leaves: { orderBy: [desc(schema.employeeLeaves.startDate)] },
        attendance: { orderBy: [desc(schema.attendance.date)], limit: 30 },
        assetAssignments: {
          with: {
            asset: true
          }
        },
        certifications: true,
        trainings: true,
        performances: { orderBy: [desc(schema.employeePerformances.reviewPeriod)] },
        documents: true,
      }
    });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Additional data for Workspace:
    // Activities (Timeline)
    const activities = await db.query.activities.findMany({
      where: eq(schema.activities.performedById, id),
      orderBy: [desc(schema.activities.date)],
      limit: 50
    });

    // Tickets
    const tickets = await db.query.tickets.findMany({
      where: eq(schema.tickets.assignedTo, id),
      orderBy: [desc(schema.tickets.createdAt)],
      limit: 50
    });

    // Projects
    const projects = await db.query.projects.findMany({
      where: eq(schema.projects.managerId, id)
    });

    res.json({
      success: true,
      data: {
        ...employee,
        timeline: activities,
        tickets,
        projects
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// NEW V2 ENDPOINTS (Enterprise Employee Core)
// ==========================================

const formatSuccess = (data: any = null, message = 'Success', meta = null) => ({
  success: true,
  message,
  data,
  ...(meta ? { meta } : {})
});

const formatError = (error: any, errorCode = 'INTERNAL_ERROR') => ({
  success: false,
  message: error.message || String(error),
  errorCode,
  timestamp: new Date().toISOString(),
  requestId: randomUUID()
});

router.get('/', async (req, res) => {
  try {
    const filters = req.query;
    const employees = await employeeService.getAllEmployees(filters);
    res.json(formatSuccess(employees));
  } catch (error: any) {
    res.status(500).json(formatError(error));
  }
});

router.get('/search', async (req, res) => {
  try {
    const { keyword } = req.query;
    const employees = await employeeService.getAllEmployees({ keyword });
    res.json(formatSuccess(employees));
  } catch (error: any) {
    res.status(500).json(formatError(error));
  }
});

router.get('/filter', async (req, res) => {
  try {
    const filters = req.query;
    const employees = await employeeService.getAllEmployees(filters);
    res.json(formatSuccess(employees));
  } catch (error: any) {
    res.status(500).json(formatError(error));
  }
});

router.get('/:id', async (req, res) => {
  try {
    if (['workspace', 'search', 'filter'].includes(req.params.id)) return; // Handled above
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.json(formatSuccess(employee));
  } catch (error: any) {
    res.status(404).json(formatError(error, 'NOT_FOUND'));
  }
});

router.post('/', async (req, res) => {
  try {
    const createdBy = (req as any).user?.id || 'system';
    const newEmployee = await employeeService.createEmployee(req.body, createdBy);
    res.status(201).json(formatSuccess(newEmployee, "Employee created successfully"));
  } catch (error: any) {
    res.status(400).json(formatError(error, 'VALIDATION_ERROR'));
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedBy = (req as any).user?.id || 'system';
    const updatedEmployee = await employeeService.updateEmployee(req.params.id, req.body, updatedBy);
    res.json(formatSuccess(updatedEmployee, "Employee updated successfully"));
  } catch (error: any) {
    res.status(400).json(formatError(error, 'VALIDATION_ERROR'));
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedBy = (req as any).user?.id || 'system';
    const result = await employeeService.deleteEmployee(req.params.id, deletedBy);
    res.json(formatSuccess(result, "Employee deleted successfully"));
  } catch (error: any) {
    res.status(400).json(formatError(error, 'DELETE_ERROR'));
  }
});

router.patch('/:id/restore', async (req, res) => {
  try {
    const updatedBy = (req as any).user?.id || 'system';
    const result = await employeeService.restoreEmployee(req.params.id, updatedBy);
    res.json(formatSuccess(result, "Employee restored successfully"));
  } catch (error: any) {
    res.status(400).json(formatError(error, 'RESTORE_ERROR'));
  }
});

router.get('/:id/organization', async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.json(formatSuccess({}));
  } catch (error: any) {
    res.status(404).json(formatError(error, 'NOT_FOUND'));
  }
});

router.get('/:id/manager', async (req, res) => {
  try {
    const employee = await employeeService.getEmployeeById(req.params.id);
    res.json(formatSuccess({}));
  } catch (error: any) {
    res.status(404).json(formatError(error, 'NOT_FOUND'));
  }
});

router.get('/:id/subordinates', async (req, res) => {
  try {
    const { id } = req.params;
    const subordinates: any[] = []; // Subordinates logic moved to assignment tree
    res.json(formatSuccess(subordinates));
  } catch (error: any) {
    res.status(500).json(formatError(error));
  }
});

export default router;
