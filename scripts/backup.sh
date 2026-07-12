#!/bin/bash
echo "Starting Database Backup..."
mkdir -p backups
BACKUP_FILE="backups/erp-backup-$(date +%Y%m%d%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" data/
echo "Backup created at $BACKUP_FILE"
