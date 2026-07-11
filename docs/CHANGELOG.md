# Changelog

## [RC-006] - 2026-07-11
### Changed
- Standardized directory structure, moving Views to `src/pages/`.
- Isolated reusable components in `src/components/`.
- Archived development patches and test scripts to `archive/`.
- Moved operational scripts to `scripts/`.
- Unified configuration files and optimized PM2 cluster mode script.
- Centralized markdown documentation in `docs/`.

### Removed
- Unused `console.log` statements for debugging.
- Temporary logic and obsolete endpoints from `server.ts`.
- Experimental bypass endpoints (`/api/debug/me`).
