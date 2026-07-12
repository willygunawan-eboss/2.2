# Division Module
## Business Rule
- 1 Company -> Many Branch -> Many Division.
- Division belongs to a Branch and Company.
- Includes full audit trailing and soft delete mechanisms.

## ERD
`divisions`
- id (UUID)
- companyId (FK -> companies)
- branchId (FK -> branches)
- code
- name
- description
- status
- isActive
- createdAt, updatedAt, createdBy, updatedBy
- deletedAt, deletedBy

`division_audits`
- id
- divisionId (FK -> divisions)
- action
- changes
- performedBy
- performedAt

## Flow
- Admin can list, create, edit, delete, and restore Divisions.
- Data flows from API route to DivisionService, ensuring all queries are decoupled from routing logic.
- Creation requires Company and Branch references.

## Future Integration
- Will serve as the parent node for Departments.
