# Enterprise Position Engine

## 1. Overview
The Position Engine is a foundational component of the ERP Organization module. A "Position" is not simply a job title; it represents a structural node in the enterprise that holds business responsibilities, approval authorities, and can be assigned to multiple employees.

## 2. Business Rules
- **Single Source of Truth**: All modules (Payroll, Attendance, Approval Matrix) must reference the Position object to determine an employee's organizational placement and authority.
- **Hierarchical Nature**: Positions are linked to structural parent positions (\`parentPositionId\`) and functional reporting lines (\`reportsToPositionId\`).
- **Multi-Tenant / Branch**: A position belongs to a specific Company, Branch, Division, Department, Section, and Team.
- **Approval Engine Readiness**: Positions contain boolean flags (\`canApproveLeave\`, \`canApprovePurchase\`, etc.) and a numeric \`approvalLevel\` to support future workflow implementations without requiring database migrations.

## 3. Database Schema (ERD)
The \`positions\` table includes:
- \`id\` (UUID, PK)
- \`code\` (String, Unique)
- \`name\` (String)
- \`company_id\`, \`branch_id\`, \`division_id\`, \`department_id\`, \`section_id\`, \`team_id\` (FKs)
- \`job_grade_id\` (FK to job_grades)
- \`parent_position_id\`, \`reports_to_position_id\` (Self-referencing FKs)
- \`level\` (Integer)
- \`employment_type_id\` (String)
- \`approval_level\` (Integer)
- \`can_approve_leave\`, \`can_approve_purchase\`, \`can_approve_expense\`, \`can_approve_project\` (Boolean)
- \`is_active\` (Boolean)
- \`version\` (Integer for Optimistic Locking)
- Standard Audit Fields (\`created_at\`, \`updated_at\`, \`deleted_at\`, etc.)

## 4. Service Layer
\`PositionService\` implements the Repository Pattern handling list, getById, create, update, delete, and restore operations.

## 5. Future Integration
- **Employee Engine**: Employees will be assigned a \`positionId\`.
- **Workflow Engine**: Approvals will traverse the \`parentPositionId\` chain.
