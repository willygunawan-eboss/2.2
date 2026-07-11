# API Reference

The application uses RESTful API design.

## Base URL
`/api/`

## Key Endpoints
- `/api/auth/*` : Authentication endpoints (login, me, logout).
- `/api/rbac/*` : Role-based Access Control endpoints.
- `/api/customers/*` : CRM capabilities.
- `/api/hr/*` : Human Resources, Payroll, Attendance.
- `/api/finance/*` : Invoicing, Purchase, Sales, Ledger.
- `/api/assets/*` : Fixed Asset management.
- `/api/helpdesk/*` : Ticketing and Incidents.

All API endpoints enforce token validation and module-level permission checking via RBAC Middleware.
