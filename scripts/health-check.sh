#!/bin/bash
echo "Performing Health Check..."
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3010/api/system/health)
if [ "$STATUS_CODE" -eq 200 ]; then
    echo "Health Check Passed! System is up and running on port 3010."
    exit 0
else
    echo "Health Check Failed. Status Code: $STATUS_CODE"
    exit 1
fi
