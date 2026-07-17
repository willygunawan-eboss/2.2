import { Router } from 'express';
import { z } from 'zod';
import { JobFamilyRepositoryImpl } from '../services/job-architecture/repository/JobFamilyRepositoryImpl.js';
import { JobGradeRepositoryImpl } from '../services/job-architecture/repository/JobGradeRepositoryImpl.js';
import { JobRepositoryImpl } from '../services/job-architecture/repository/JobRepositoryImpl.js';
import { JobArchitectureApplicationService } from '../services/job-architecture/application/JobArchitectureApplicationService.js';

const router = Router();

const jobFamilyRepo = new JobFamilyRepositoryImpl();
const jobGradeRepo = new JobGradeRepositoryImpl();
const jobRepo = new JobRepositoryImpl();

const jobArchitectureService = new JobArchitectureApplicationService(
  jobFamilyRepo,
  jobGradeRepo,
  jobRepo
);

// VALIDATORS
const createJobFamilySchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().nullable().optional()
});

const updateJobFamilySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional()
});

const createJobGradeSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  level: z.number().int().min(1),
  description: z.string().nullable().optional()
});

const updateJobGradeSchema = z.object({
  name: z.string().min(1).optional(),
  level: z.number().int().min(1).optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional()
});

const createJobSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  jobFamilyId: z.string().uuid(),
  jobGradeId: z.string().uuid(),
  description: z.string().nullable().optional()
});

const updateJobSchema = z.object({
  name: z.string().min(1).optional(),
  jobFamilyId: z.string().uuid().optional(),
  jobGradeId: z.string().uuid().optional(),
  description: z.string().nullable().optional(),
  isActive: z.boolean().optional()
});

// JOB FAMILY ENDPOINTS
router.post('/families', async (req, res) => {
  try {
    const data = createJobFamilySchema.parse(req.body);
    const result = await jobArchitectureService.createJobFamily(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/families/:id', async (req, res) => {
  try {
    const data = updateJobFamilySchema.parse(req.body);
    const result = await jobArchitectureService.updateJobFamily(req.params.id, data);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/families/:id', async (req, res) => {
  try {
    await jobArchitectureService.deleteJobFamily(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/families', async (req, res) => {
  try {
    const result = await jobArchitectureService.getAllJobFamilies();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/families/:id', async (req, res) => {
  try {
    const result = await jobArchitectureService.getJobFamily(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// JOB GRADE ENDPOINTS
router.post('/grades', async (req, res) => {
  try {
    const data = createJobGradeSchema.parse(req.body);
    const result = await jobArchitectureService.createJobGrade(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/grades/:id', async (req, res) => {
  try {
    const data = updateJobGradeSchema.parse(req.body);
    const result = await jobArchitectureService.updateJobGrade(req.params.id, data);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/grades/:id', async (req, res) => {
  try {
    await jobArchitectureService.deleteJobGrade(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/grades', async (req, res) => {
  try {
    const result = await jobArchitectureService.getAllJobGrades();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/grades/:id', async (req, res) => {
  try {
    const result = await jobArchitectureService.getJobGrade(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

// JOB ENDPOINTS
router.post('/jobs', async (req, res) => {
  try {
    const data = createJobSchema.parse(req.body);
    const result = await jobArchitectureService.createJob(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/jobs/:id', async (req, res) => {
  try {
    const data = updateJobSchema.parse(req.body);
    const result = await jobArchitectureService.updateJob(req.params.id, data);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/jobs/:id', async (req, res) => {
  try {
    await jobArchitectureService.deleteJob(req.params.id);
    res.status(204).send();
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/jobs', async (req, res) => {
  try {
    const result = await jobArchitectureService.getAllJobs();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/jobs/:id', async (req, res) => {
  try {
    const result = await jobArchitectureService.getJob(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
});

export { router as jobArchitectureRoutes };
