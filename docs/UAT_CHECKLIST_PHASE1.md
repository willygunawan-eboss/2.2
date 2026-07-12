# UAT Checklist: Phase 1 (Enterprise Foundation Refactor)

## 1. Bootstrap & Initialization
- [ ] Application correctly initializes and routes to Bootstrap on fresh run.
- [ ] Bootstrap safely seeds Company, Branch, Division, Department, Section, Position, Job Grade, and SUPER_ADMIN account.
- [ ] Idempotency: Re-running bootstrap does NOT create duplicate records.

## 2. Authentication & RBAC
- [ ] User can log in with SUPER_ADMIN credentials.
- [ ] SUPER_ADMIN bypasses standard route permissions (Global Bypass verified).

## 3. Executive Dashboard
- [ ] Dashboard correctly identifies missing Master Data and displays "Master Data Incomplete" prompt.
- [ ] Navigating from the prompt leads directly to the Enterprise Control Center.
- [ ] Dashboard charts accurately reflect real employee counts and demographics (no mock data).

## 4. Enterprise Control Center
- [ ] Navigation sidebar accurately reflects groupings: Organization, HR, Workflow, Security, Infrastructure.
- [ ] Organization tabs (Company, Branch, Division, Department, Section, Position, Job Grade) load their respective data grids.
- [ ] Empty or unimplemented modules display "Module Pending Initialization" state instead of crashing.

## 5. System Readiness (ERP Setup Center)
- [ ] Progress bar accurately reflects the percentage of initialized/passed checks.
- [ ] Component list matches architectural modules (Database, API, RBAC, CRM, HR, etc.).
