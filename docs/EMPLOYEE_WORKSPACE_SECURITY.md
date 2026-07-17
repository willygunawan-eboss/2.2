# Employee Workspace Security

## Role-Based Access Control (RBAC)
Follows the Permission Engine matrix. Valid roles include `SUPER_ADMIN`, `HR_ADMIN`, `HR_MANAGER`, `MANAGER`, `SUPERVISOR`. 
- **UI Element Visibility**: Action buttons (Edit, Transfer, Restore) are automatically hidden if the user lacks sufficient permissions.

## Data Protection
- **No Direct Object Reference**: APIs validate that the user is authorized to view the requested Employee's data.
- **Secure Handling**: No sensitive information is cached improperly in local storage.
- **Error Obfuscation**: Database-level SQLite errors are never exposed; they are sanitized by the Validation Layer into business rules.
