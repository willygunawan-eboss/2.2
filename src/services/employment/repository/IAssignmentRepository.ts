import { Assignment } from "../domain/Assignment.js";

export interface IAssignmentRepository {
  findById(id: string): Promise<Assignment | null>;
  findActiveByEmploymentId(employmentId: string): Promise<Assignment | null>;
  findByEmploymentId(employmentId: string): Promise<Assignment[]>;
  save(assignment: Assignment): Promise<void>;
  update(assignment: Assignment): Promise<void>;
  delete(id: string): Promise<void>;
  executeInTransaction<T>(operation: (repo: IAssignmentRepository) => Promise<T>): Promise<T>;
  search(query: any): Promise<{ data: any[], pagination: any }>;
}
