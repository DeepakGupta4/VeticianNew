@echo off
echo ========================================
echo Help & Support Feature Setup
echo ========================================
echo.

echo Installing web admin panel dependencies...
cd web
call npm install
echo.

echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: cd backend ^&^& npm start
echo 2. Start web admin: cd web ^&^& npm run dev
echo 3. Start mobile app: cd vetician-provider ^&^& npm start
echo.
echo For detailed documentation, see HELP_SUPPORT_IMPLEMENTATION.md
echo.
pause
