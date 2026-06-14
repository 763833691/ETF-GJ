@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   ETF Platform - Start Script
echo ========================================
echo.

set "ROOT_DIR=%~dp0"
set "API_PORT=8000"
set "WEB_PORT=5173"

:: Check node
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js 20+
    pause
    exit /b 1
)

:: Check pnpm
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] pnpm not found. Run: npm install -g pnpm
    pause
    exit /b 1
)

:: Install dependencies if needed
if not exist "%ROOT_DIR%node_modules" (
    echo [INFO] Installing dependencies...
    cd /d "%ROOT_DIR%"
    call pnpm install
    echo.
)

:: Start API server
echo [START] API server on port %API_PORT%...
start "ETF-API" cmd /k "cd /d "%ROOT_DIR%" && pnpm --filter api dev"

:: Wait for API
echo [WAIT] Waiting for API server...
timeout /t 3 /nobreak >nul

:: Start Web server
echo [START] Web server on port %WEB_PORT%...
start "ETF-Web" cmd /k "cd /d "%ROOT_DIR%" && pnpm --filter web dev"

:: Wait for Web
echo [WAIT] Waiting for Web server...
timeout /t 5 /nobreak >nul

:: Open browser
echo [OPEN] Opening browser...
start "" "http://localhost:%WEB_PORT%"

echo.
echo ========================================
echo   DONE!
echo.
echo   Frontend: http://localhost:%WEB_PORT%
echo   Backend:  http://localhost:%API_PORT%
echo.
echo   Close this window will NOT stop services.
echo   Press Ctrl+C in each service window to stop.
echo ========================================
echo.

pause
