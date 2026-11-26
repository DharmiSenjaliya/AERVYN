#!/usr/bin/env bash
# ==============================================================================
# AERVYN: ECHOES OF TIME - Linux Server Automated Setup Script
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

echo "=============================================================================="
echo " [AERVYN] Initializing automated setup for Linux Server..."
echo "=============================================================================="

# 1. Backend Setup
echo "[AERVYN] Configuring Backend (Laravel 12)..."
cd "$ROOT_DIR/backend"

if [ ! -f .env ]; then
    echo "[AERVYN] Creating backend .env from .env.example..."
    cp .env.example .env
    echo "[AERVYN] NOTE: Please edit backend/.env with your MySQL credentials!"
fi

echo "[AERVYN] Installing Composer dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "[AERVYN] Generating Application Key..."
php artisan key:generate --force

echo "[AERVYN] Setting storage permissions..."
chmod -R 775 storage bootstrap/cache public/uploads

echo "[AERVYN] Running database migrations..."
php artisan migrate --force

# 2. Frontend Setup
echo ""
echo "[AERVYN] Configuring Frontend (React + Vite)..."
cd "$ROOT_DIR/frontend"

if [ ! -f .env ]; then
    echo "[AERVYN] Creating frontend .env from .env.example..."
    cp .env.example .env
fi

echo "[AERVYN] Installing npm packages..."
npm ci --silent || npm install

echo "[AERVYN] Building frontend for production..."
npm run build

echo ""
echo "=============================================================================="
echo " [AERVYN] Linux installation and compilation completed successfully!"
echo " Web root directory for Nginx: $ROOT_DIR/frontend/dist"
echo " Backend root directory for PHP: $ROOT_DIR/backend/public"
echo "=============================================================================="
