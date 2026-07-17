import { Router } from 'express';
import { z } from 'zod';
import { HireEmployeeUseCase } from '../application/HireEmployeeUseCase';
import { EventPublisherImpl } from '../../employment/infrastructure/EventPublisherImpl';
import { WorkforceUnitOfWorkImpl } from '../infrastructure/WorkforceUnitOfWorkImpl';
import { WorkforceDomainError } from '../domain/WorkforceErrors';
import { TransferEmployeeUseCase } from '../application/TransferEmployeeUseCase';
import { PromoteEmployeeUseCase } from '../application/PromoteEmployeeUseCase';
import { TerminateEmployeeUseCase } from '../application/TerminateEmployeeUseCase';
import { MutateEmployeeUseCase } from '../application/MutateEmployeeUseCase';
import { AuditServiceImpl } from '../../employment/infrastructure/AuditServiceImpl';
import { TimelineServiceImpl } from '../../employment/infrastructure/TimelineServiceImpl';

import { PolicyApplicationService } from '../../policy/application/PolicyApplicationService';
import { WorkflowApplicationService } from '../../workflow/application/WorkflowApplicationService';
import { InMemoryPolicyRepository } from '../../policy/infrastructure/InMemoryPolicyRepository';
import { InMemoryWorkflowDefinitionRepository, InMemoryWorkflowInstanceRepository } from '../../workflow/infrastructure/InMemoryWorkflowRepository';
import { InMemoryWorkflowEventPublisher } from '../../workflow/infrastructure/InMemoryWorkflowEventPublisher';


const router = Router();

const eventPublisher = new EventPublisherImpl();
const unitOfWork = new WorkforceUnitOfWorkImpl();

const policyRepo = new InMemoryPolicyRepository();
const policyService = new PolicyApplicationService(policyRepo);
const wfDefRepo = new InMemoryWorkflowDefinitionRepository();
const wfInstRepo = new InMemoryWorkflowInstanceRepository();
const wfEventPub = new InMemoryWorkflowEventPublisher();
const workflowService = new WorkflowApplicationService(wfDefRepo, wfInstRepo, wfEventPub);

const auditService = new AuditServiceImpl();
const timelineService = new TimelineServiceImpl();
const transferEmployeeUseCase = new TransferEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);
const mutateEmployeeUseCase = new MutateEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);
const terminateEmployeeUseCase = new TerminateEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);
const promoteEmployeeUseCase = new PromoteEmployeeUseCase(unitOfWork, eventPublisher, policyService, workflowService, auditService, timelineService);

const hireEmployeeUseCase = new HireEmployeeUseCase(unitOfWork, eventPublisher, auditService, timelineService);




const HireEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee Number is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional().nullable(),
  nationalIdentityNumber: z.string().optional().nullable(),
  companyId: z.string().min(1, "Company is required"),
  branchId: z.string().min(1, "Branch is required"),
  divisionId: z.string().min(1, "Division is required"),
  departmentId: z.string().min(1, "Department is required"),
  jobGradeId: z.string().min(1, "Job Grade is required"),
  employmentType: z.string().min(1, "Employment Type is required"),
  employmentStatus: z.string().min(1, "Employment Status is required"),
  organizationId: z.string().min(1, "Organization is required"),
  positionId: z.string().min(1, "Position is required"),
  effectiveDate: z.string().min(1, "Effective Date is required"),
  contractStartDate: z.string().optional().nullable(),
});

router.post('/hire', async (req, res) => {
  try {
    const actor = (req as any).user?.id || 'SYSTEM';
    
    const validatedData = HireEmployeeSchema.parse(req.body);
    
    const result = await hireEmployeeUseCase.execute({
      ...validatedData,
      actor
    } as any);

    res.status(201).json({
      status: "success",
      message: "Employee hired successfully",
      data: result
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        status: "error",
        message: "Validation Error",
        errors: error.issues
      });
    }

    if (error instanceof WorkforceDomainError) {
      return res.status(400).json({
        status: "error",
        message: error.message,
        code: error.code
      });
    }

    res.status(400).json({
      status: "error",
      message: error.message || "Failed to hire employee"
    });
  }
});


const TransferEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee Number is required"),
  companyId: z.string().min(1, "Company is required"),
  newOrganizationId: z.string().min(1, "New Organization is required"),
  newPositionId: z.string().min(1, "New Position is required"),
  effectiveDate: z.string().min(1, "Effective Date is required"),
  reason: z.string().min(1, "Reason is required"),
});

router.post('/transfer', async (req, res) => {
  try {
    const actor = (req as any).user?.id || 'SYSTEM';
    const validatedData = TransferEmployeeSchema.parse(req.body);
    const result = await transferEmployeeUseCase.execute({
      ...validatedData,
      actor
    });
    res.status(200).json({
      status: "success",
      message: "Employee transferred successfully",
      data: result
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    }
    if (error instanceof WorkforceDomainError) {
      return res.status(400).json({ status: "error", message: error.message, code: error.code });
    }
    res.status(400).json({ status: "error", message: error.message || "Failed to transfer employee" });
  }
});


const PromoteEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee Number is required"),
  companyId: z.string().min(1, "Company is required"),
  newOrganizationId: z.string().min(1, "New Organization is required"),
  newPositionId: z.string().min(1, "New Position is required"),
  newJobGradeId: z.string().optional(),
  effectiveDate: z.string().min(1, "Effective Date is required"),
  reason: z.string().min(1, "Reason is required"),
});

router.post('/promote', async (req, res) => {
  try {
    const actor = (req as any).user?.id || 'SYSTEM';
    const validatedData = PromoteEmployeeSchema.parse(req.body);
    const result = await promoteEmployeeUseCase.execute({
      ...validatedData,
      actor
    });
    res.status(200).json({
      status: "success",
      message: "Employee promoted successfully",
      data: result
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    }
    if (error instanceof WorkforceDomainError) {
      return res.status(400).json({ status: "error", message: error.message, code: error.code });
    }
    res.status(400).json({ status: "error", message: error.message || "Failed to promote employee" });
  }
});


const MutateEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee Number is required"),
  companyId: z.string().min(1, "Company is required"),
  newOrganizationId: z.string().min(1, "New Organization is required"),
  newPositionId: z.string().min(1, "New Position is required"),
  effectiveDate: z.string().min(1, "Effective Date is required"),
  reason: z.string().min(1, "Reason is required"),
});

router.post('/mutate', async (req, res) => {
  try {
    const actor = (req as any).user?.id || 'SYSTEM';
    const validatedData = MutateEmployeeSchema.parse(req.body);
    const result = await mutateEmployeeUseCase.execute({
      ...validatedData,
      actor
    });
    res.status(200).json({ status: "success", message: "Employee mutated successfully", data: result });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    if (error instanceof WorkforceDomainError) return res.status(400).json({ status: "error", message: error.message, code: error.code });
    res.status(400).json({ status: "error", message: error.message || "Failed to mutate employee" });
  }
});

const TerminateEmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee Number is required"),
  effectiveDate: z.string().min(1, "Effective Date is required"),
  reason: z.string().min(1, "Reason is required"),
  terminationType: z.string().min(1, "Termination Type is required"),
});

router.post('/terminate', async (req, res) => {
  try {
    const actor = (req as any).user?.id || 'SYSTEM';
    const validatedData = TerminateEmployeeSchema.parse(req.body);
    const result = await terminateEmployeeUseCase.execute({
      ...validatedData,
      actor
    });
    res.status(200).json({ status: "success", message: "Employee terminated successfully", data: result });
  } catch (error: any) {
    if (error instanceof z.ZodError) return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    if (error instanceof WorkforceDomainError) return res.status(400).json({ status: "error", message: error.message, code: error.code });
    res.status(400).json({ status: "error", message: error.message || "Failed to terminate employee" });
  }
});

export default router;

