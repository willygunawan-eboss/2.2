# Frontend Audit

## Components & State
- Reusable components exist but there is duplication across Manager views (`BranchManager.tsx`, `DivisionManager.tsx`, `TeamManager.tsx`).
- Modals for creation and editing are often duplicated inside each Manager component.

## Violations & Technical Debt
1. **Duplicate Fetch Logic**: Each Manager component manually implements `useEffect` for data fetching. This should be abstracted into a custom hook (e.g., `useMasterData`).
2. **Large Components**: `DashboardView.tsx` and manager components are excessively large and handle both layout and data fetching.
3. **Repeated Renders**: Unoptimized `useEffect` dependencies cause unnecessary re-renders when switching tabs in the workspace.
