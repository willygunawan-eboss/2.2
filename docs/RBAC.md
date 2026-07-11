# Role Based Access Control (RBAC)

The system relies on an integrated RBAC engine to provide granular access control to modules.

## Roles
- Defined in the database.
- Super Admin bypasses all checks.

## Permissions
- `READ`, `WRITE`, `DELETE`, `APPROVE` based on modules.

## Implementation
- **Backend**: `requirePermission('HR_MODULE', 'READ')` middleware.
- **Frontend**: `<PermissionGate module="HR_MODULE" action="READ">` wrapper.
