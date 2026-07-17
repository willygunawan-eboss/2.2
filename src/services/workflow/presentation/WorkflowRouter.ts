import { Router } from 'express';
import { z } from 'zod';
import { WorkflowApplicationService } from '../application/WorkflowApplicationService';
import { InMemoryWorkflowDefinitionRepository, InMemoryWorkflowInstanceRepository } from '../infrastructure/InMemoryWorkflowRepository';
import { InMemoryWorkflowEventPublisher } from '../infrastructure/InMemoryWorkflowEventPublisher';
import { WorkflowDomainError } from '../domain/WorkflowErrors';

const router = Router();

// For Foundation Sprint, we inject In-Memory repos
const definitionRepo = new InMemoryWorkflowDefinitionRepository();
const instanceRepo = new InMemoryWorkflowInstanceRepository();
const eventPublisher = new InMemoryWorkflowEventPublisher();
const workflowService = new WorkflowApplicationService(definitionRepo, instanceRepo, eventPublisher);

const StartWorkflowSchema = z.object({
  definitionId: z.string().min(1, "Definition ID is required"),
  referenceType: z.string().min(1, "Reference Type is required"),
  referenceId: z.string().min(1, "Reference ID is required"),
  context: z.any().optional()
});

const ExecuteTransitionSchema = z.object({
  action: z.string().min(1, "Action is required"),
  comments: z.string().optional()
});

router.post('/start', async (req, res) => {
  try {
    const actor = (req as any).user?.id || 'SYSTEM';
    const validatedData = StartWorkflowSchema.parse(req.body);
    
    const instance = await workflowService.startWorkflow(
      validatedData.definitionId,
      validatedData.referenceType,
      validatedData.referenceId,
      validatedData.context || {},
      actor
    );

    res.status(201).json({
      status: "success",
      data: instance
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    }
    if (error instanceof WorkflowDomainError) {
      return res.status(400).json({ status: "error", message: error.message, code: error.code });
    }
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.post('/:instanceId/transition', async (req, res) => {
  try {
    const actor = (req as any).user?.id || 'SYSTEM';
    const validatedData = ExecuteTransitionSchema.parse(req.body);
    
    const instance = await workflowService.executeTransition(
      req.params.instanceId,
      validatedData.action,
      actor,
      validatedData.comments
    );

    res.status(200).json({
      status: "success",
      data: instance
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    }
    if (error instanceof WorkflowDomainError) {
      return res.status(400).json({ status: "error", message: error.message, code: error.code });
    }
    res.status(400).json({ status: "error", message: error.message });
  }
});

export default router;
