# ICHANGEBOSS ERP - Architecture Document

## Overview
The ERP is a full-stack monolithic application tailored for deployment on a local Ubuntu Server, designed with simplicity and ease of maintenance in mind.

## Technology Stack
- **Frontend**: React 19, Vite, TailwindCSS, Lucide Icons, Recharts.
- **Backend**: Express.js (Node.js) coupled with Vite middleware in development, and bundled via esbuild for production.
- **Database**: SQLite (via `better-sqlite3`) utilizing Drizzle ORM.
- **Security**: JWT-based Authentication and Role-Based Access Control (RBAC).

## Design Philosophy
- **Single Monolith**: The frontend SPA and backend API are served by a single Node.js process (Port 3010).
- **SQLite Database**: Uses local file `data/erp.db` suitable for small to medium scale operations.
- **Modular Monolith**: Code is divided into domains (HR, CRM, Finance, Asset, CMDB, Contract).
