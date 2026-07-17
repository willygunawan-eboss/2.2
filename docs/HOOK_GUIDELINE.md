# Hook Guidelines

- Use generic hooks for state (e.g., `useWorkspaceTabs`).
- Avoid direct DB/API calls inside UI hooks. Move them to service hooks (e.g., `useEmployeeWorkspace`).
- Prefer `useMemo` for expensive client-side filtering (e.g., debounced search filtering).