# Technical Debt Register

## Architecture Debt
- **Missing Repository Layer**: Tight coupling of ORM and business logic in the Service layer.

## Frontend Debt
- **Duplicate CRUD Components**: `CompanyManager`, `BranchManager`, `DivisionManager` share >80% identical logic and UI. Needs a generic `MasterDataGrid` component.
- **Lack of Data Fetching Library**: Manual `fetch` and `useEffect` instead of React Query or SWR, leading to boilerplate and caching issues.

## Backend Debt
- **Manual Audit Trails**: Hardcoded `AuditLog` insertions in every service method instead of a centralized database trigger or ORM middleware.

## Security Debt
- **Granular Permissions**: RBAC is role-based but some endpoints lack granular resource-level permission checks.
