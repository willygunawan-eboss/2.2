import { IPolicyRepository } from "../repository/IPolicyRepository";
import { Policy, PolicyContext, EvaluationResult } from "../domain/Policy";
import { PolicyNotFoundError } from "../domain/PolicyErrors";
import { PolicyEffect, ConditionOperator } from "../domain/PolicyEnums";

export interface CreatePolicyDTO {
  code: string;
  name: string;
  description: string;
  defaultEffect: PolicyEffect;
}

export interface AddRuleDTO {
  name: string;
  description?: string;
  priority: number;
  effect: PolicyEffect;
  conditions: {
    field: string;
    operator: ConditionOperator;
    value: any;
  }[];
}

export class PolicyApplicationService {
  constructor(
    private readonly policyRepo: IPolicyRepository
  ) {}

  async createPolicy(dto: CreatePolicyDTO): Promise<Policy> {
    const policy = Policy.create(null, dto.code, dto.name, dto.description, dto.defaultEffect);
    await this.policyRepo.save(policy);
    return policy;
  }

  async addRuleToPolicy(policyId: string, dto: AddRuleDTO): Promise<Policy> {
    const policy = await this.policyRepo.findById(policyId);
    if (!policy) throw new PolicyNotFoundError(policyId);

    policy.addRule({
      name: dto.name,
      description: dto.description,
      priority: dto.priority,
      effect: dto.effect
    }, dto.conditions);

    await this.policyRepo.save(policy);
    return policy;
  }

  async activatePolicy(policyId: string): Promise<Policy> {
    const policy = await this.policyRepo.findById(policyId);
    if (!policy) throw new PolicyNotFoundError(policyId);

    policy.activate();
    await this.policyRepo.save(policy);
    return policy;
  }

  async evaluatePolicyByCode(policyName: string, context: PolicyContext): Promise<EvaluationResult> {
    const policy = await this.policyRepo.findByCode(policyName);
    if (!policy) throw new PolicyNotFoundError(policyName);
    return policy.evaluate(context);
  }

  async evaluatePolicy(policyId: string, context: PolicyContext): Promise<EvaluationResult> {
    const policy = await this.policyRepo.findById(policyId);
    if (!policy) throw new PolicyNotFoundError(policyId);

    return policy.evaluate(context);
  }
}
