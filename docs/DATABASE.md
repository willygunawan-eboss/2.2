# Database Architecture

We use **SQLite** with **Drizzle ORM**.

## Location
- `data/erp.db`: The main database file.
- `data/erp.db-shm` / `data/erp.db-wal`: Write-Ahead Logging files.

## Migrations
- Define schemas in `src/db/schema.ts`.
- Run migrations: `npx drizzle-kit push`.
- Seed data: `node --import tsx scripts/run-seed.js`.

## Key Domains
- Auth & RBAC
- Organization & Users
- CRM (Customers)
- HR (Employees, Payroll, Attendance)
- Finance (Transactions, Sales, Invoicing)
- Asset & CMDB
- Helpdesk
