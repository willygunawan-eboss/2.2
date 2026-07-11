# Deployment Guide

## Prerequisites
- Ubuntu Server 20.04 or 22.04 LTS
- Node.js (v20+)
- PM2 installed globally (`npm install -g pm2`)

## Step-by-Step
1. **Pull Code**: Pull the latest Release Candidate from the GitHub repository.
2. **Install Dependencies**: Run `npm install` to install production dependencies.
3. **Build**: Run `npm run build` to build the frontend and bundle the backend.
4. **Environment**: Ensure `.env` is properly configured (PORT=3010).
5. **Start Process**: Run `pm2 start ecosystem.config.cjs`.
6. **Save State**: Run `pm2 save`.

## Backup Strategy
Use `./backup-erp.sh` to take a local snapshot of the `data/` directory.
