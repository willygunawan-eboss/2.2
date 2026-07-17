# Backend Audit

## Service Layer
- Business logic is centralized in the `src/services/` directory.
- Example: `OrganizationService.ts`, `CompanyService.ts`, `BranchService.ts`.

## Routing
- Routes in `src/routes/` successfully delegate logic to services.
- Route controllers are minimal and mostly handle request parsing and response formatting.

## Violations
1. **Database Access in Services**: `db.select()` and `db.insert()` are mixed directly in services, violating the clean architecture principle requiring a dedicated Repository layer.
2. **Duplicate Validations**: Input validations are sometimes performed in the router and repeated in the service layer.
