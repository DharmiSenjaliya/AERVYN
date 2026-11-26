@echo off
REM ============================================================================
REM AERVYN: ECHOES OF TIME - Database Backup Script (Windows)
REM Note: Reads DB_DATABASE, DB_USERNAME, DB_HOST from user input or environment.
REM Never hardcode credentials into this script!
REM ============================================================================

setlocal enabledelayedexpansion

set BACKUP_DIR=%~dp0..\database\backups
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,8%_%datetime:~8,6%
set BACKUP_FILE=%BACKUP_DIR%\aervyn_backup_%TIMESTAMP%.sql

echo ============================================================================
echo [AERVYN] Database Backup Utility
echo Target File: %BACKUP_FILE%
echo ============================================================================

set /p DB_HOST="Enter MySQL Host [127.0.0.1]: " || set DB_HOST=127.0.0.1
if "%DB_HOST%"=="" set DB_HOST=127.0.0.1

set /p DB_PORT="Enter MySQL Port [3306]: " || set DB_PORT=3306
if "%DB_PORT%"=="" set DB_PORT=3306

set /p DB_NAME="Enter Database Name [aervyn_db]: " || set DB_NAME=aervyn_db
if "%DB_NAME%"=="" set DB_NAME=aervyn_db

set /p DB_USER="Enter MySQL Username [aervyn_user]: " || set DB_USER=aervyn_user
if "%DB_USER%"=="" set DB_USER=aervyn_user

echo.
echo [AERVYN] Running mysqldump (you will be prompted for your password)...
mysqldump -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p --single-transaction --quick %DB_NAME% > "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Backup completed successfully: %BACKUP_FILE%
) else (
    echo [ERROR] Backup failed. Please verify your credentials.
)

pause
