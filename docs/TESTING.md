# Testing Framework Documentation
**Project:** ICHANGEBOSS ERP

## Layers of Testing
The ERP incorporates multiple layers of testing to guarantee product stability and enterprise readiness.

### 1. Static Analysis
- **TypeScript**: Enforces strict typing. All components and API routes are validated against the `schema.ts`.
- **ESLint**: Standardizes code formatting and catches potential logic flaws (e.g., unused variables, missing dependencies in `useEffect`).

### 2. Manual CRUD & Regression
Each release candidate (RC) undergoes a complete pass of:
- Create, Read, Update, Delete for all core entities.
- Validating Pagination, Sorting, and Search functionality.
- UI regression testing across all modules (HR, Finance, Sales, etc.).

### 3. Automated End-to-End Testing (Playwright)
We use Playwright to simulate real user interactions within a headless Chromium browser. 
Tests cover:
- Authentication flow.
- Wizard routing and bootstrap flow.
- Core data manipulation.

To run the tests locally:
\`\`\`bash
npx playwright test
\`\`\`
To view the report:
\`\`\`bash
npx playwright show-report
\`\`\`
