#!/usr/bin/env bash
# ==============================================================================
# AERVYN: ECHOES OF TIME - Linux Production Deployment Script
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=============================================================================="
echo " [AERVYN] Executing Zero-Downtime Production Deployment..."
echo "=============================================================================="

# 1. Backend Optimization
echo "[AERVYN] 1/4 - Optimizing Laravel Backend..."
cd "$ROOT_DIR/backend"
composer install --no-dev --optimize-autoloader --no-interaction

php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan migrate --force

# 2. Frontend Production Compilation
echo "[AERVYN] 2/4 - Compiling React Frontend..."
cd "$ROOT_DIR/frontend"
npm ci --silent || npm install
npm run build

# 3. Permissions Verification
echo "[AERVYN] 3/4 - Setting permissions..."
cd "$ROOT_DIR/backend"
chmod -R 775 storage bootstrap/cache public/uploads

echo "[AERVYN] 4/4 - Deployment finished successfully!"
echo " Web root: $ROOT_DIR/frontend/dist"
echo " API root: $ROOT_DIR/backend/public"
