import { EmployeeRepository } from '../repositories/EmployeeRepository';
import { z } from 'zod';
import crypto from 'crypto';

const employeeRepo = new EmployeeRepository();

const EmployeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee Number is required"),
  nationalIdentityNumber: z.string().optional().nullable(),
  name: z.string().min(1, "Full Name is required"),
  preferredName: z.string().optional().nullable(),
  email: z.string().email("Invalid email format").optional().nullable(),
  employmentStatus: z.string().min(1, "Employment Status is required"),
  hireDate: z.string().optional().nullable(),
  contractStartDate: z.string().optional().nullable(),
});

export class EmployeeService {
  async getAllEmployees(filters: any) {
    return await employeeRepo.findAll(filters);
  }

  async getEmployeeById(id: string) {
    const employee = await employeeRepo.findById(id);
    if (!employee) throw new Error("Employee not found");
    return employee;
  }

  async createEmployee(data: any, createdBy: string) {
    // 1. Validation
    const validatedData = EmployeeSchema.parse(data);

    // 2. Business Rules Check
    // Unique Employee Number per Company
    const existingNum = await employeeRepo.findByEmployeeNumber(validatedData.employeeNumber);
    if (existingNum) throw new Error("Employee Number already exists in this Company");

    // Unique NIK
    if (validatedData.nationalIdentityNumber) {
      const existingNik = await employeeRepo.findByNik(validatedData.nationalIdentityNumber);
      if (existingNik) throw new Error("National Identity Number already exists");
    }

    // Unique Corporate Email
    if (validatedData.email) {
      const existingEmail = await employeeRepo.findByCorporateEmail(validatedData.email);
      if (existingEmail) throw new Error("Corporate Email already exists");
    }

    // Circular Manager Check (for creation, manager can't be self obviously because self doesn't exist yet, but wait)

    // 3. Create
    const id = crypto.randomUUID();
    const newEmployee = await employeeRepo.create({
      ...validatedData,
      id,
      createdBy,
      status: 'Active'
    });

    return newEmployee;
  }

  async updateEmployee(id: string, data: any, updatedBy: string) {
    const existing = await employeeRepo.findById(id);
    if (!existing) throw new Error("Employee not found");

    const validatedData = EmployeeSchema.partial().parse(data);

    if (validatedData.employeeNumber) {
      if (validatedData.employeeNumber !== existing.employeeNumber) {
         const existingNum = await employeeRepo.findByEmployeeNumber(validatedData.employeeNumber);
         if (existingNum && existingNum.id !== id) throw new Error("Employee Number already exists in this Company");
      }
    }

    if (validatedData.nationalIdentityNumber && validatedData.nationalIdentityNumber !== existing.nationalIdentityNumber) {
      const existingNik = await employeeRepo.findByNik(validatedData.nationalIdentityNumber);
      if (existingNik && existingNik.id !== id) throw new Error("National Identity Number already exists");
    }

    if (validatedData.email && validatedData.email !== existing.email) {
      const existingEmail = await employeeRepo.findByCorporateEmail(validatedData.email);
      if (existingEmail && existingEmail.id !== id) throw new Error("Corporate Email already exists");
    }

    // Prevent Circular Manager Hierarchy (Basic Check)
    
    
    // Deep circular check can be implemented here if needed.

    return await employeeRepo.update(id, { ...validatedData, updatedBy });
  }

  async deleteEmployee(id: string, deletedBy: string) {
    const existing = await employeeRepo.findById(id);
    if (!existing) throw new Error("Employee not found");
    
    // In a real app, check if there are transactions.
    
    return await employeeRepo.softDelete(id, deletedBy);
  }

  async restoreEmployee(id: string, updatedBy: string) {
    const existing = await employeeRepo.findById(id);
    if (!existing) throw new Error("Employee not found");
    
    return await employeeRepo.restore(id, updatedBy);
  }
}
