@echo off
REM ============================================================================
REM AERVYN: ECHOES OF TIME - Windows Automated Local Setup Script
REM ============================================================================

echo [AERVYN] Initializing automated setup for Windows...
echo.

REM 1. Backend Setup
echo [AERVYN] Configuring Backend (Laravel 12)...
cd /d "%~dp0..\backend"

if not exist .env (
    echo [AERVYN] Creating backend .env from .env.example...
    copy .env.example .env
    echo [AERVYN] Please update your database credentials in backend\.env before continuing!
)

echo [AERVYN] Installing Composer dependencies...
call composer install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Composer installation failed. Please verify PHP and Composer are installed.
    pause
    exit /b %ERRORLEVEL%
)

echo [AERVYN] Generating Application Key...
call php artisan key:generate

echo [AERVYN] Running database migrations...
call php artisan migrate --force
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Database migration failed. Ensure MySQL service is running and credentials in .env are correct.
)

REM 2. Frontend Setup
echo.
echo [AERVYN] Configuring Frontend (React + Vite)...
cd /d "%~dp0..\frontend"

if not exist .env (
    echo [AERVYN] Creating frontend .env from .env.example...
    copy .env.example .env
)

echo [AERVYN] Installing Node.js packages...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm install failed. Please verify Node.js is installed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ============================================================================
echo [AERVYN] Setup completed successfully!
echo.
echo To launch the local development environment:
echo 1. Start Backend:  cd backend ^&^& php artisan serve
echo 2. Start Frontend: cd frontend ^&^& npm run dev
echo.
echo Access the game in your browser at: http://localhost:5173
echo Admin portal located at:           http://localhost:5173/admin/login
echo ============================================================================
pause
