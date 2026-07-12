# Enterprise Job Grade Engine

## 1. Overview
The Job Grade Engine manages the enterprise compensation and classification structure. It classifies positions into standardized levels, dictating compensation bands and hierarchical sequence.

## 2. Business Rules
- **Decoupled from Employees**: Job Grades are tied to Positions, not directly to Employees. This ensures standard compensation mapping for structural roles.
- **Level and Sequence**: \`level\` is a strict numeric representation of the grade's rank in the enterprise. \`sequence\` is used for granular display ordering.
- **Salary Bands**: Each job grade has optional \`minimumSalary\`, \`maximumSalary\`, and \`currency\` fields to define the compensation range.

## 3. Database Schema
The \`job_grades\` table includes:
- \`id\` (UUID, PK)
- \`code\` (String, Unique)
- \`name\` (String)
- \`level\` (Integer, Not Null)
- \`sequence\` (Integer)
- \`minimum_salary\` (Real)
- \`maximum_salary\` (Real)
- \`currency\` (String, Default IDR)
- \`is_active\` (Boolean)
- Standard Audit Fields

## 4. Service Layer
\`JobGradeService\` manages CRUD operations cleanly without exposing the raw database query implementation to the route controllers.

## 5. Future Integration
- **Payroll Module**: Uses the minimum/maximum salary bands for validation and anomaly detection.
- **Recruitment Module**: Utilizes the job grade compensation ranges for job postings.
