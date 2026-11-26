#!/usr/bin/env bash
# ==============================================================================
# AERVYN: ECHOES OF TIME - Linux Database Restore Script
# ==============================================================================

set -e

echo "=============================================================================="
echo " [WARNING] AERVYN Database Restoration Utility"
echo " This operation will overwrite existing tables in the target database!"
echo "=============================================================================="

read -p "Enter path to SQL or SQL.GZ backup file: " BACKUP_FILE
if [ ! -f "$BACKUP_FILE" ]; then
    echo "[ERROR] File not found: $BACKUP_FILE"
    exit 1
fi

read -p "Type 'RESTORE' to confirm: " CONFIRM
if [ "$CONFIRM" != "RESTORE" ]; then
    echo "[ABORTED] Restoration cancelled by user."
    exit 0
fi

read -p "Enter MySQL Host [127.0.0.1]: " DB_HOST
DB_HOST=${DB_HOST:-127.0.0.1}

read -p "Enter Database Name [aervyn_db]: " DB_NAME
DB_NAME=${DB_NAME:-aervyn_db}

read -p "Enter MySQL Username [aervyn_user]: " DB_USER
DB_USER=${DB_USER:-aervyn_user}

echo "Restoring database..."
if [[ "$BACKUP_FILE" == *.gz ]]; then
    gunzip -c "$BACKUP_FILE" | mysql -h "$DB_HOST" -u "$DB_USER" -p "$DB_NAME"
else
    mysql -h "$DB_HOST" -u "$DB_USER" -p "$DB_NAME" < "$BACKUP_FILE"
fi

echo "[SUCCESS] Database restoration complete."
