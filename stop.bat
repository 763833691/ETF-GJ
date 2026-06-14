@echo off

echo ========================================
echo   ETF Platform - Stop Script
echo ========================================
echo.

echo [STOP] Stopping API server...
taskkill /FI "WindowTitle eq ETF-API*" /T /F >nul 2>nul

echo [STOP] Stopping Web server...
taskkill /FI "WindowTitle eq ETF-Web*" /T /F >nul 2>nul

echo.
echo [DONE] All services stopped.
echo ========================================

pause
