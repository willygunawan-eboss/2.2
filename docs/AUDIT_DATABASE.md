# Database Audit

## Schema Rules Checked
- Primary Key: `id` (text/UUID).
- Foreign Key: Present for organization hierarchy (e.g., `branch.companyId`).
- Audit Fields: `createdAt`, `updatedAt`, `createdBy`, `updatedBy` are mostly present but sometimes inconsistent.
- Soft Delete: `isActive`, `isDeleted` indicators are present.

## Findings
1. **Inconsistent Audit Fields**: Some tables lack standard `createdBy` and `updatedBy` fields.
2. **Orphan Relations**: If a `Company` is soft-deleted, cascading updates/soft-deletes to `Branch` or `Division` are handled in code rather than via database constraints.
3. **UUID Implementation**: IDs use string generation (nanoid/uuid) at the application layer rather than native DB UUIDs.
