import { Policy } from "../domain/Policy";

export interface IPolicyRepository {
  findById(id: string): Promise<Policy | null>;
  findByCode(name: string): Promise<Policy | null>;
  save(policy: Policy): Promise<void>;
  findAll(): Promise<Policy[]>;
}
