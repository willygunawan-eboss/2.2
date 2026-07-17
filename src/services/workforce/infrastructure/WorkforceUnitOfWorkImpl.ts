import { IWorkforceUnitOfWork } from "../application/ports/IWorkforceUnitOfWork";
import { EmployeeRepository } from "../../../repositories/EmployeeRepository";
import { EmploymentRepositoryImpl } from "../../employment/repository/EmploymentRepositoryImpl";
import { AssignmentRepositoryImpl } from "../../employment/repository/AssignmentRepositoryImpl";
import { OrganizationRepositoryImpl } from "../../organization/repository/OrganizationRepositoryImpl";
import { PositionRepositoryImpl } from "../../position/repository/PositionRepositoryImpl";
import { db } from "../../../db";

export class WorkforceUnitOfWorkImpl implements IWorkforceUnitOfWork {
  async execute<T>(operation: (repositories: any) => Promise<T>): Promise<T> {
    return await db.transaction(async (tx) => {
      const employeeRepo = new EmployeeRepository(tx);
      const employmentRepo = new EmploymentRepositoryImpl(tx);
      const assignmentRepo = new AssignmentRepositoryImpl(tx);
      const orgRepo = new OrganizationRepositoryImpl(tx);
      const posRepo = new PositionRepositoryImpl(tx);

      return operation({
        employeeRepo,
        employmentRepo,
        assignmentRepo,
        orgRepo,
        posRepo
      });
    });
  }
}
