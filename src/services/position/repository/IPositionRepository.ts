import { Position } from "../domain/Position.js";

export interface IPositionRepository {
  findById(id: string): Promise<Position | null>;
  findByCode(code: string): Promise<Position | null>;
  findByNameAndCompany(name: string, companyId: string): Promise<Position | null>;
  save(position: Position): Promise<void>;
  update(position: Position): Promise<void>;
  delete(id: string): Promise<void>;
  isPositionInUse(id: string): Promise<boolean>;
  executeInTransaction<T>(operation: (repo: IPositionRepository) => Promise<T>): Promise<T>;
  search(query: any): Promise<{ data: any[], pagination: any }>;
}
