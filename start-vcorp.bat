@echo off
cd /d "%~dp0"
title V-CORP Career Readiness Platform
echo ====================================================
echo   Starting V-CORP Local Server...
echo ====================================================
echo.
echo Launching backend and frontend services...
start "V-CORP Server" cmd /k "npm run dev"
echo Waiting for services to initialize...
timeout /t 4 /nobreak > nul
echo Opening Portal in Browser...
start http://localhost:5173
echo.
echo ====================================================
echo   V-CORP is running at http://localhost:5173
echo   (Keep the "V-CORP Server" window open while using)
echo ====================================================
timeout /t 3 > nul
