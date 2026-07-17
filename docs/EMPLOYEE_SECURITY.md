# Employee Security

## RBAC & Authentication
All endpoints are secured via JWT `authMiddleware` and `rbacMiddleware`. Only roles with specific permissions (e.g., SUPER_ADMIN, HR_ADMIN, HR_MANAGER) can perform destructive or write operations.

## Input Validation
Zod validation layer (`EmployeeSchema`) is strictly applied at the Service level to prevent invalid data injections and ensure structural integrity before database interactions.
