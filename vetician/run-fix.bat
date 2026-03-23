@echo off
echo ========================================
echo   Paravet Schema Fix - Automated
echo ========================================
echo.

cd backend

echo [1/3] Checking current database state...
echo.
node check-database.js
echo.

echo.
echo [2/3] Running migration to fix schema...
echo.
node fix-schema-migration.js
echo.

echo.
echo [3/3] Verifying fix...
echo.
node check-database.js
echo.

echo.
echo ========================================
echo   Fix Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Restart your backend server (Ctrl+C then npm start)
echo 2. Clear your browser cache (Ctrl+Shift+R)
echo 3. Test the onboarding flow
echo.
pause
