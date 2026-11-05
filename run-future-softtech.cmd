@echo off
setlocal
cd /d "%~dp0"

echo ==============================================
echo   Future SoftTech website - local development
echo ==============================================
echo.

where node >nul 2>&1
if errorlevel 1 goto :need_node
for /f "tokens=1 delims=." %%A in ('node -p "process.versions.node"') do set "NODE_MAJOR=%%A"
if %NODE_MAJOR% LSS 20 goto :old_node
where npm >nul 2>&1
if errorlevel 1 goto :need_node

if not exist "server\.env" (
  copy "server\.env.example" "server\.env" >nul
  echo Created server\.env from the example.
  echo Update DATABASE_URL with your PostgreSQL username and password.
  echo Also create the future_softtech database in PostgreSQL or pgAdmin.
  echo.
  notepad "server\.env"
  echo Save and close server\.env, then run this script again.
  pause
  exit /b 1
)

if not exist "node_modules\concurrently" goto :install_deps
if not exist "server\node_modules" goto :install_deps
if not exist "client\node_modules" goto :install_deps
goto :init_db

:install_deps
echo Installing project packages. This may take a few minutes...
call npm run install:all
if errorlevel 1 goto :failed

:init_db
echo Checking and creating database tables...
call npm run db:init
if errorlevel 1 goto :database_error

echo.
echo Starting the site and API. Keep this window open.
echo Open http://localhost:5173 in your browser.
echo Press Ctrl+C here to stop the project.
echo.
call npm run dev
set "DEV_EXIT=%ERRORLEVEL%"
echo.
echo The development server stopped with exit code %DEV_EXIT%.
echo If it stopped unexpectedly, review the error messages above.
pause
exit /b %DEV_EXIT%

:need_node
echo Node.js 20 or newer and npm are required.
echo Install Node.js from https://nodejs.org, then run this script again.
pause
exit /b 1

:old_node
echo Node.js 20 or newer is required. Current version:
node --version
echo Install a current Node.js version from https://nodejs.org.
pause
exit /b 1

:database_error
echo.
echo Could not initialize the database. Check that PostgreSQL is running,
echo the future_softtech database exists, and server\.env has the right DATABASE_URL.
pause
exit /b 1

:failed
echo Package installation failed. Review the error above, then run this script again.
pause
exit /b 1
