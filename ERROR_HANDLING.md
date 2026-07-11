# Error Handling Documentation

## Philosophy
The ERP handles errors gracefully. The end user should never see a "White Screen" or a raw technical stack trace (e.g., SQLite constraint error).

## 1. Global Error Boundary
Implemented in `src/components/GlobalErrorBoundary.tsx` and wrapped around the root application in `src/App.tsx`.
- **Purpose**: Catches any runtime UI exceptions that occur during the React render phase.
- **Features**:
  - Displays a clean, professional error card.
  - Generates a unique `Request ID` / `Log ID` for support tickets.
  - Offers immediate "Retry / Reload" and "Return to Home" recovery paths.
  - Hides technical stack traces behind an expandable "View Technical Details" toggle.

## 2. API Interceptors & Form Validation
- Forms enforce `required` constraints before hitting the network.
- Failed HTTP requests map server-side JSON error messages to toast notifications or inline form errors rather than unhandled promise rejections.
- SQLite foreign key and unique constraints are caught in the backend (`server.ts`) and returned as structured `{ success: false, message: 'Friendly error' }` responses.

## 3. Network Resiliency
- State logic (like the Bootstrap wizard) is mirrored to `localStorage` to survive accidental page reloads or network drops during multi-step processes.
