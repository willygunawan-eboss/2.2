# Deployment Guide

## Prerequisites
- Ubuntu Server 20.04 or 22.04 LTS
- Node.js (v20+)
- PM2 installed globally (`npm install -g pm2`)

## Step-by-Step
We have provided automated scripts for deployment, rollback, and recovery.

### 1. Deployment
To deploy the latest changes from the master branch, simply run:
```bash
./scripts/deploy.sh
```
This script will automatically:
1. Fetch and pull the latest changes from GitHub (`git reset --hard`).
2. Run `npm install` for dependencies.
3. Apply database migrations (`npx drizzle-kit push`).
4. Build the application (`npm run build`).
5. Restart PM2 on Port 3010.
6. Run a health check against `/api/system/health`.

### 2. Rollback
If a deployment fails and you need to revert to the previous state:
```bash
./scripts/rollback.sh
```

### 3. Database Fix (Corrupt DB)
If you experience a malformed SQLite database, you can reset it:
```bash
./scripts/fix-db.sh
```

## Backup Strategy
Make sure to regularly backup the `data/` directory. You can set up a cron job to archive it to a remote storage.
