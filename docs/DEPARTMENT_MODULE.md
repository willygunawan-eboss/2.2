# Department Module
## Business Rule
- 1 Division -> Many Department.
- Department belongs to a Division, Branch, and Company.
- Includes cost center, manager assignment logic, full audit trailing, and soft delete.

## ERD
`departments`
- id (UUID)
- companyId (FK -> companies)
- branchId (FK -> branches)
- divisionId (FK -> divisions)
- managerPositionId (nullable)
- code
- name
- description
- costCenter
- status
- isActive
- createdAt, updatedAt, createdBy, updatedBy
- deletedAt, deletedBy

`department_audits`
- id
- departmentId (FK -> departments)
- action
- changes
- performedBy
- performedAt

## Flow
- Admin can list, create, edit, delete, and restore Departments.
- Data flows from API route to DepartmentService, ensuring decoupled DB operations.
- Creation requires Division, Branch, and Company references.
- Supports hierarchy filters on the UI (Company -> Branch -> Division).

## Future Integration
- Will serve as core attribute for Employee profiles, Project cost tracking, Purchase logic, Inventory allocation, and Assets assignments.
