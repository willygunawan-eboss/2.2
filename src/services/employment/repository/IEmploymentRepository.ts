import { Employment } from "../domain/Employment.js";

export interface IEmploymentRepository {
  findById(id: string): Promise<Employment | null>;
  findByEmployeeNumber(employeeNumber: string): Promise<Employment | null>;
  findByOrganization(organizationId: string): Promise<Employment[]>;
  save(employment: Employment): Promise<void>;
  update(employment: Employment): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  executeInTransaction<T>(operation: (repo: IEmploymentRepository) => Promise<T>): Promise<T>;
  
  // Queries
  search(query: any): Promise<{ data: any[], pagination: any }>;
}
