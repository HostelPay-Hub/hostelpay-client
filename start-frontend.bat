@echo off
REM HostelPay Hub - Frontend Startup Script

echo.
echo ========================================
echo HostelPay Hub - Frontend Startup
echo ========================================
echo.

REM Check if in correct directory
if not exist "package.json" (
    echo Error: package.json not found. Please run from hostelpay-client directory.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo npm install failed
        pause
        exit /b 1
    )
)

REM Start dev server
echo.
echo Starting React development server...
echo Frontend will be available at: http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev

if %errorlevel% equ 0 (
    echo.
    echo Frontend stopped successfully
) else (
    echo.
    echo Frontend startup failed
    echo Check that Node.js is installed: https://nodejs.org/
)

pause
