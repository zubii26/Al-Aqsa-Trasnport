#!/bin/bash
# Database Backup Script for MongoDB
# This script should be run via cron, e.g. daily at 03:00 AM
# 0 3 * * * /path/to/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1

# Source environment variables if running manually or ensure they are passed in cron
set -a
source ../.env.local
set +a

if [ -z "$MONGODB_URI" ]; then
    echo "[ERROR] MONGODB_URI is not set."
    exit 1
fi

BACKUP_DIR="../backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="backup_${TIMESTAMP}.gz"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "[INFO] Starting database backup at $(date)..."

# Run mongodump and compress the output directly
mongodump --uri="$MONGODB_URI" --archive="${BACKUP_DIR}/${BACKUP_FILE}" --gzip

if [ $? -eq 0 ]; then
    echo "[SUCCESS] Backup created successfully: ${BACKUP_DIR}/${BACKUP_FILE}"
    
    # Optional: Remove backups older than 30 days
    find "$BACKUP_DIR" -type f -name "backup_*.gz" -mtime +30 -exec rm {} \;
    echo "[INFO] Cleaned up backups older than 30 days."
else
    echo "[ERROR] Backup failed."
    exit 1
fi
