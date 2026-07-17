# Employee Workspace API Specification

## Endpoints

### Aggregated Workspace Data
- **`GET /api/employees/:id/workspace`**
  Returns comprehensive data needed for the workspace, structured to minimize client-side requests.
  - **Includes**: Employee details, organizational assignment (Company, Branch, Department, Position), manager details, and employment summaries.

### API Standards
- **Response Format**:
  ```json
  {
    "success": true,
    "message": "Data retrieved successfully",
    "data": { ... }
  }
  ```
- **Error Handling**: Converts all internal errors (e.g., SQLite constraint violations) into friendly business validation errors. No stack traces are returned to the client.
