# Organization Registry

## Purpose
The Organization Registry is a caching layer built to minimize database hits when fetching the enterprise structure.

## Caching Strategy
- In-memory cache with Time-To-Live (TTL).
- Manual and automatic invalidation endpoints (`/api/organization/platform/cache/refresh`).
- Reduces repeated `SELECT` queries across core HR and Payroll modules.
