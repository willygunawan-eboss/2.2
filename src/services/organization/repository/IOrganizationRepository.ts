import { Organization } from "../domain/Organization.js";

export interface IOrganizationRepository {
  findById(id: string): Promise<Organization | null>;
  findByCode(code: string): Promise<Organization | null>;
  findChildren(parentId: string): Promise<Organization[]>;
  save(org: Organization): Promise<void>;
  update(org: Organization): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  findRoot(): Promise<Organization | null>;
  findDescendants(id: string): Promise<Organization[]>;
  executeInTransaction<T>(operation: (repo: IOrganizationRepository) => Promise<T>): Promise<T>;

  // Queries
  getTree(): Promise<any[]>;
  search(query: any): Promise<{ data: any[], pagination: any }>;
}
