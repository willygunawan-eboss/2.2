# Security Audit

## Middleware & Protections
- **Authentication**: `authMiddleware` checks for JWT in cookies.
- **RBAC**: `rbacMiddleware.ts` is implemented and used for authorization.
- **CORS**: Implemented globally.
- **Headers**: Basic implementation, missing strict CSP and HSTS headers.

## Vulnerabilities & Findings
1. **Unprotected Endpoints**: Need to ensure every new domain route explicitly applies `authMiddleware` and `rbacMiddleware`.
2. **Audit Log Consistency**: Action logging for `CREATE`, `UPDATE`, `DELETE` is done manually in services; it should be abstracted to an interceptor or subscriber to prevent omissions.
3. **Session Management**: JWT tokens in cookies are used, but a centralized token invalidation (logout everywhere) mechanism is lacking.
