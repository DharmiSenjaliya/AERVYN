#!/usr/bin/env bash
# ==============================================================================
# AERVYN: ECHOES OF TIME - Linux Database Backup Script
# Creates a compressed, timestamped mysqldump backup in database/backups/
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$ROOT_DIR/database/backups"

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/aervyn_backup_${TIMESTAMP}.sql.gz"

echo "=============================================================================="
echo " [AERVYN] Database Backup Utility"
echo " Target File: $BACKUP_FILE"
echo "=============================================================================="

read -p "Enter MySQL Host [127.0.0.1]: " DB_HOST
DB_HOST=${DB_HOST:-127.0.0.1}

read -p "Enter Database Name [aervyn_db]: " DB_NAME
DB_NAME=${DB_NAME:-aervyn_db}

read -p "Enter MySQL Username [aervyn_user]: " DB_USER
DB_USER=${DB_USER:-aervyn_user}

echo "Enter password for MySQL user $DB_USER:"
mysqldump -h "$DB_HOST" -u "$DB_USER" -p --single-transaction --quick "$DB_NAME" | gzip > "$BACKUP_FILE"

echo "[SUCCESS] Compressed backup written to: $BACKUP_FILE"
