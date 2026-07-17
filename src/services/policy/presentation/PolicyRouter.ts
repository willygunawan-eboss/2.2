import { Router } from 'express';
import { z } from 'zod';
import { PolicyApplicationService } from '../application/PolicyApplicationService';
import { InMemoryPolicyRepository } from '../infrastructure/InMemoryPolicyRepository';
import { PolicyDomainError } from '../domain/PolicyErrors';
import { PolicyEffect, ConditionOperator } from '../domain/PolicyEnums';

const router = Router();

// For Foundation Sprint, we inject In-Memory repos
const policyRepo = new InMemoryPolicyRepository();
const policyService = new PolicyApplicationService(policyRepo);

const CreatePolicySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional().default(''),
  defaultEffect: z.enum([PolicyEffect.ALLOW, PolicyEffect.DENY])
});

const AddRuleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  priority: z.number().int(),
  effect: z.enum([PolicyEffect.ALLOW, PolicyEffect.DENY]),
  conditions: z.array(z.object({
    field: z.string().min(1),
    operator: z.nativeEnum(ConditionOperator),
    value: z.any()
  }))
});

const EvaluatePolicySchema = z.object({
  context: z.record(z.string(), z.any())
});

router.post('/', async (req, res) => {
  try {
    const validatedData = CreatePolicySchema.parse(req.body);
    const policy = await policyService.createPolicy(validatedData);
    res.status(201).json({ status: "success", data: policy });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    }
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.post('/:policyId/rules', async (req, res) => {
  try {
    const validatedData = AddRuleSchema.parse(req.body);
    const policy = await policyService.addRuleToPolicy(req.params.policyId, validatedData);
    res.status(200).json({ status: "success", data: policy });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    }
    if (error instanceof PolicyDomainError) {
      return res.status(400).json({ status: "error", message: error.message, code: error.code });
    }
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.post('/:policyId/evaluate', async (req, res) => {
  try {
    const validatedData = EvaluatePolicySchema.parse(req.body);
    const result = await policyService.evaluatePolicy(req.params.policyId, validatedData.context);
    res.status(200).json({ status: "success", data: result });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ status: "error", message: "Validation Error", errors: error.issues });
    }
    if (error instanceof PolicyDomainError) {
      return res.status(400).json({ status: "error", message: error.message, code: error.code });
    }
    res.status(400).json({ status: "error", message: error.message });
  }
});

export default router;
