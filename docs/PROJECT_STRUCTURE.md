# Project Structure

```
├── archive/        - Archived code, old patches, experiments.
├── data/           - Local SQLite database and backups.
├── dist/           - Build artifacts (Vite & ESBuild).
├── docs/           - Documentation (Architecture, Deployment).
├── scripts/        - Utility scripts for deployment, seeding, DB.
├── src/            - Source Code (Frontend & Backend integrations).
│   ├── assets/     - Static assets.
│   ├── components/ - Reusable React Components, Modals, Elements.
│   ├── contexts/   - React Context (e.g. AuthContext, RBACContext).
│   ├── db/         - Drizzle ORM Schema, Index, and Seeder.
│   ├── pages/      - Main Views / Application Screens.
│   ├── routes/     - Backend Express route handlers.
│   ├── types/      - Shared TypeScript types.
│   └── utils/      - Utility functions.
├── server.ts       - Entry point for Node.js Backend.
└── ecosystem.config.cjs - PM2 cluster configuration.
```
