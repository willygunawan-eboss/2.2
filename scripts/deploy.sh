#!/bin/bash
echo "Starting Deployment for ICHANGEBOSS ERP..."
git fetch origin
git reset --hard origin/main
echo "Installing Dependencies..."
npm install
echo "Running Database Migrations..."
npx drizzle-kit push --config=drizzle.config.ts
echo "Building Application..."
npm run build
echo "Restarting PM2 Process..."
pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs
echo "Saving PM2 State..."
pm2 save
echo "Running Health Check..."
./scripts/health-check.sh
echo "Deployment Complete."
