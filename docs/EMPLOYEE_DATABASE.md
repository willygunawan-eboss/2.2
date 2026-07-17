# Employee Database Schema

## Table: `employees`
Stores the single source of truth for all employee information. Contains foreign keys to `companies`, `branches`, `divisions`, `departments`, `sections`, `teams`, `positions`, and `job_grades`. Includes self-referencing foreign keys for `manager_employee_id` and `supervisor_employee_id`.

No circular schema references. Enforces UNIQUE constraint on `employee_number`.
