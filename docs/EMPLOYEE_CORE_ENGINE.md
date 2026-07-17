# Employee Core Engine (Sprint 3.1.1)

## Overview
Employee Core Engine is the fundamental building block of the Human Capital Management Platform. The `Employee` entity acts as the Aggregate Root for all HCM modules (Attendance, Leave, Payroll, Recruitment, etc.), establishing a Single Source of Truth for identity and organizational assignment.

## Architecture
- **Domain Driven Design**: The Employee domain is isolated and central.
- **Clean Architecture**: Implementation spans `EmployeeRepository` (DB access), `EmployeeService` (Business Rules), and RESTful controllers.
- **Master Data Separation**: Employment Status is treated as a master reference, while organizational links (Company, Branch, Department, Position) directly reference the Organization Platform.
