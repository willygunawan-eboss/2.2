# Architecture Audit

## Project Structure
- Application is a monolith using Express (Backend) and React + Vite (Frontend).
- Entry points: `server.ts` (Backend) and `src/main.tsx` (Frontend).

## Dependency Layers
- `server.ts` routes requests to `src/routes/*`.
- `src/routes/*` delegates business logic to `src/services/*`.
- `src/services/*` queries the database via Drizzle ORM configured in `src/db/schema.ts`.
- This generally follows Application -> Router -> Service -> Database.

## Violations & Findings
1. **Missing Repository Layer**: Currently, SQL and ORM calls are tightly coupled within the `Service` layer (e.g., `CompanyService.ts` calls `db.insert` directly). A true Repository Pattern should separate data access logic from business logic.
2. **Circular Dependencies**: There are no prominent circular dependencies observed between major layers, but combining ORM with Service logic reduces testability and separation of concerns.
