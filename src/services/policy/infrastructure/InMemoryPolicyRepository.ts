import { IPolicyRepository } from "../repository/IPolicyRepository";
import { Policy } from "../domain/Policy";

export class InMemoryPolicyRepository implements IPolicyRepository {
  private readonly policies = new Map<string, Policy>();

  async findById(id: string): Promise<Policy | null> {
    return this.policies.get(id) || null;
  }

  async findByCode(name: string): Promise<Policy | null> {
    for (const policy of this.policies.values()) {
      if (policy.code === name) return policy;
    }
    return null;
  }

  async save(policy: Policy): Promise<void> {
    this.policies.set(policy.id, policy);
  }

  async findAll(): Promise<Policy[]> {
    return Array.from(this.policies.values());
  }
}
