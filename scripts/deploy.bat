@echo off
REM ============================================================================
REM AERVYN: ECHOES OF TIME - Windows Production Deployment & Build Script
REM ============================================================================

echo ============================================================================
echo [AERVYN] Starting Production Deployment Build...
echo ============================================================================

REM 1. Backend Optimization
echo [AERVYN] 1/4 - Optimizing Backend (Laravel 12)...
cd /d "%~dp0..\backend"

call composer install --no-dev --optimize-autoloader --no-interaction
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Composer optimization failed.
    pause
    exit /b %ERRORLEVEL%
)

echo [AERVYN] 2/4 - Caching configuration, routes, and views...
call php artisan config:cache
call php artisan route:cache
call php artisan view:cache
call php artisan migrate --force

REM 2. Frontend Production Compilation
echo [AERVYN] 3/4 - Compiling Frontend (React 19 + Vite 8)...
cd /d "%~dp0..\frontend"
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend Vite build failed.
    pause
    exit /b %ERRORLEVEL%
)

echo [AERVYN] 4/4 - Production deployment build complete!
echo Production assets generated in: frontend\dist
echo.
pause
