@echo off
echo Starting ChainSpec Environment...

:: 1. Start Dashboard in a new window
echo Starting Dashboard...
start "ChainSpec Dashboard" cmd /k "cd dashboard && npm run dev"

:: 2. Wait a moment for dashboard to init
timeout /t 5 /nobreak >nul

:: 3. Open Kiro CLI in a new window (assuming WSL)
echo Starting Kiro CLI...
start "Kiro IDE" wsl /home/khushi/.local/bin/kiro-cli chat

echo.
echo ===================================================
echo     ChainSpec started!
echo     - Dashboard: http://localhost:3000
echo     - Kiro CLI: Running in separate window
echo ===================================================
echo.
pause
