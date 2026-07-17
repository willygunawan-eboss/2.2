import { IEmploymentRepository } from "../../../employment/repository/IEmploymentRepository";
import { IAssignmentRepository } from "../../../employment/repository/IAssignmentRepository";
import { IOrganizationRepository } from "../../../organization/repository/IOrganizationRepository";
import { IPositionRepository } from "../../../position/repository/IPositionRepository";

// Using a simplified interface for EmployeeRepository since it might not have an exact interface yet
export interface IEmployeeRepo {
  findAll(filters: any): Promise<any[]>;
  findByEmployeeNumber(employeeNumber: string): Promise<any>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
}

export interface IWorkforceUnitOfWork {
  execute<T>(operation: (repositories: {
    employeeRepo: IEmployeeRepo,
    employmentRepo: IEmploymentRepository,
    assignmentRepo: IAssignmentRepository,
    orgRepo: IOrganizationRepository,
    posRepo: IPositionRepository
  }) => Promise<T>): Promise<T>;
}
