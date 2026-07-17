# Employee Business Rules

## Key Constraints
- **Business Key**: `employeeNumber` is unique per Company.
- **National ID**: `nationalIdentityNumber` is unique across the system if provided.
- **Email**: `corporateEmail` is unique across the system if provided.
- **Organization Constraint**: Every employee MUST be assigned to at least a Company, Branch, Division, Department, Position, and Job Grade.
- **Manager Hierarchy**: `managerEmployeeId` and `supervisorEmployeeId` must not point to the employee themselves (circular check).
- **Soft Deletion**: Employees are never hard-deleted; their status is updated to `Inactive` and `deletedAt` is populated.
