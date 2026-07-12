# Architecture Decision Record (ADR)
## Title: Enterprise Foundation Refactor & Master Data Integrity
## Date: 2026-07-12
## Context
The ERP system needed a solid structural foundation to support multiple enterprise modules. The previous setup had overlapping business logic and hardcoded values, posing a maintenance risk.
## Decision
1. **Single Source of Truth**: All enterprise modules must adhere to the core organizational hierarchy: `Company → Branch → Division → Department → Section → Position → Job Grade → Employee`.
2. **Master Data Rigidity**: `sections` table was explicitly added to ensure full hierarchy compliance. `employees` and `positions` schemas were updated to inherit this relational standard.
3. **Control Center Consolidation**: We merged disparate settings into a single `Enterprise Control Center`, categorized logically to support seamless configurations post-bootstrap.
4. **Adaptive Dashboard**: Implemented conditional rendering to advise users on missing Master Data rather than showing mocked or empty zeroes, aligning with Enterprise UX standards.
## Status
Accepted.
