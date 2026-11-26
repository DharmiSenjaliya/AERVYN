@echo off
REM ============================================================================
REM AERVYN: ECHOES OF TIME - Database Restore Script (Windows)
REM ============================================================================

setlocal enabledelayedexpansion

echo ============================================================================
echo [WARNING] AERVYN Database Restoration Utility
echo This operation will overwrite existing tables in the target database!
echo ============================================================================

set /p BACKUP_FILE="Enter full path to SQL backup file: "
if not exist "%BACKUP_FILE%" (
    echo [ERROR] Backup file does not exist: %BACKUP_FILE%
    pause
    exit /b 1
)

set /p CONFIRM="Type 'RESTORE' to proceed with database restoration: "
if not "%CONFIRM%"=="RESTORE" (
    echo [ABORTED] Restoration cancelled by user.
    pause
    exit /b 0
)

set /p DB_HOST="Enter MySQL Host [127.0.0.1]: " || set DB_HOST=127.0.0.1
if "%DB_HOST%"=="" set DB_HOST=127.0.0.1

set /p DB_PORT="Enter MySQL Port [3306]: " || set DB_PORT=3306
if "%DB_PORT%"=="" set DB_PORT=3306

set /p DB_NAME="Enter Database Name [aervyn_db]: " || set DB_NAME=aervyn_db
if "%DB_NAME%"=="" set DB_NAME=aervyn_db

set /p DB_USER="Enter MySQL Username [aervyn_user]: " || set DB_USER=aervyn_user
if "%DB_USER%"=="" set DB_USER=aervyn_user

echo.
echo [AERVYN] Restoring database from %BACKUP_FILE%...
mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p %DB_NAME% < "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Database restored successfully.
) else (
    echo [ERROR] Database restore failed. Please inspect error messages above.
)

pause
