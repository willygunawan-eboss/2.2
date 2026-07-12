# Company Management Module

## Enterprise Architecture
- **Schema**: `companies` table extended with all enterprise required fields (Legal Name, Business Type, Tax Number, Contact Info, Branding, Meta).
- **Service Layer**: `CompanyService` encapsulates business logic for Default Company switching, soft deletion, and granular audit trail logging.
- **Routing**: Replaced generic auto-CRUD with explicit enterprise-grade RESTful paths under `/api/org/companies`.
- **Validation**: Strict validation powered by `zod`.
- **RBAC**: Handled by `requirePermission('company', 'read' | 'write' | 'delete')`, permitting `SUPER_ADMIN` and `SYSTEM_ADMIN`.
- **UI/UX**: Custom `CompanyManager` component mapping to an Enterprise Split-Pane view, including deep tabs for General, Address, Tax, Contact, Branding, and full Audit Trail.

## Features
- **Soft Delete**: Companies are soft-deleted instead of dropped.
- **Restore**: Companies can be restored.
- **Audit**: Every change (CREATE, UPDATE, DELETE, RESTORE) produces an immutable record in `company_audits`.
- **Business Rule Constraints**: Default companies cannot be deleted, but a new Default can be set which automatically dethrones the previous Default.

## Database
- Extended `companies` table
- Added `company_audits` table

## Sprint Recommendation (2.1.3)
- Move on to expanding `branches` and `departments` structures based on similar architectural foundations.
