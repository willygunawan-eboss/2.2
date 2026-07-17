import { describe, it, expect, beforeEach } from 'vitest';
import { PolicyApplicationService } from './PolicyApplicationService';
import { InMemoryPolicyRepository } from '../infrastructure/InMemoryPolicyRepository';
import { PolicyEffect, ConditionOperator } from '../domain/PolicyEnums';

describe('PolicyApplicationService', () => {
  let policyRepo: InMemoryPolicyRepository;
  let service: PolicyApplicationService;

  beforeEach(() => {
    policyRepo = new InMemoryPolicyRepository();
    service = new PolicyApplicationService(policyRepo);
  });

  it('should evaluate policy rules correctly', async () => {
    const policy = await service.createPolicy({
      name: 'Leave Approval Policy',
      code: 'LEAVE_APP_POL_001',
      description: 'Determines if a leave requires HR approval',
      defaultEffect: PolicyEffect.DENY
    });

    await service.addRuleToPolicy(policy.id, {
      name: 'Auto-approve short leave',
      priority: 10,
      effect: PolicyEffect.ALLOW,
      conditions: [
        { field: 'durationDays', operator: ConditionOperator.LESS_THAN_OR_EQUALS, value: 3 },
        { field: 'hasBalance', operator: ConditionOperator.EQUALS, value: true }
      ]
    });

    await service.addRuleToPolicy(policy.id, {
      name: 'Deny long leave without balance',
      priority: 20,
      effect: PolicyEffect.DENY,
      conditions: [
        { field: 'hasBalance', operator: ConditionOperator.EQUALS, value: false }
      ]
    });

    await service.activatePolicy(policy.id);

    // Context 1: Short leave, has balance
    const result1 = await service.evaluatePolicy(policy.id, { durationDays: 2, hasBalance: true });
    expect(result1.isAllowed).toBe(true);
    expect(result1.effect).toBe(PolicyEffect.ALLOW);
    expect(result1.matchedRules[0]).toBe('Auto-approve short leave');

    // Context 2: Long leave, has balance (falls back to default)
    const result2 = await service.evaluatePolicy(policy.id, { durationDays: 5, hasBalance: true });
    expect(result2.isAllowed).toBe(false);
    expect(result2.effect).toBe(PolicyEffect.DENY); // Default effect
    
    // Context 3: Any leave, no balance (higher priority rule)
    const result3 = await service.evaluatePolicy(policy.id, { durationDays: 2, hasBalance: false });
    expect(result3.isAllowed).toBe(false);
    expect(result3.effect).toBe(PolicyEffect.DENY);
    expect(result3.matchedRules[0]).toBe('Deny long leave without balance');
  });
});
