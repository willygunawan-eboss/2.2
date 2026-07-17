# API Audit

## Endpoint Domains
- **Authentication**: `/api/auth/*` (Handled in `server.ts`).
- **Organization**: `/api/org/*`, `/api/organization/workspace/*`, `/api/organization/platform/*`.
- **RBAC**: `/api/rbac/*`.
- **Employee**: `/api/employees/*`.
- **Master Data**: Customers (`/api/customers/*`), Assets (`/api/assets/*`), Contracts (`/api/contracts/*`).

## Consistency
- Response formats generally follow `{ success: boolean, data?: any, error?: string }`.
- Status codes are mostly standard (200, 400, 401, 403, 500).

## Findings
1. Some legacy endpoints or test endpoints lack proper RESTful naming conventions.
2. Pagination and filtering query parameters are inconsistently named across different list endpoints.
