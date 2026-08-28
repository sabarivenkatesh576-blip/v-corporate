@echo off
title V-CORP — Virtual Corporate Ecosystem (SIH 2026)
echo =========================================================================
echo   V-CORP — Virtual Corporate Experience & Career Readiness Platform
echo   Smart India Hackathon 2026 Edition
echo =========================================================================
echo.
echo [1/3] Ensuring Node.js environment...
set PATH=C:\Program Files\nodejs;%PATH%

echo [2/3] Checking MongoDB and dependencies...
cd /d "%~dp0"

echo [3/3] Launching Full-Stack Services (Backend: Port 5000 | Frontend: Port 5173)...
echo.
echo Point your browser to http://localhost:5173
echo Demo Student Login: demo@vcorp.local / Demo@12345
echo Demo Admin Login:   admin@vcorp.local / Admin@12345
echo.
npm run dev
pause
