#!/bin/bash
echo "Rolling back deployment..."
# Get previous HEAD if possible
PREVIOUS_COMMIT=$(git rev-parse HEAD@{1} 2>/dev/null)

if [ -z "$PREVIOUS_COMMIT" ]; then
    echo "No previous commit found via reflog, falling back to HEAD~1"
    PREVIOUS_COMMIT="HEAD~1"
fi

echo "Rolling back to $PREVIOUS_COMMIT"
git reset --hard $PREVIOUS_COMMIT

echo "Installing Dependencies..."
npm install

echo "Building Application..."
npm run build

echo "Restarting PM2 Process..."
pm2 restart ecosystem.config.cjs || pm2 start ecosystem.config.cjs

echo "Rollback Complete."
