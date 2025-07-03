@echo off
setlocal

set JAR_BUILD=back\build\libs\constructor.jar
set HEALTH_URL=http://localhost:8080/actuator/health
set FRONT_DIR=front
set FRONT_PORT=80

if not exist "%JAR_BUILD%" (
    echo [Error] file %JAR_BUILD% not found
    pause
    exit /b 1
)

echo [Backend]
start "Backend" cmd /k java -jar "%JAR_BUILD%"


set MAX_TRIES=30
set TRY=0

:check_loop
set /a TRY+=1

curl -s -o nul -w "%%{http_code}" %HEALTH_URL% | findstr "200" > nul
if not errorlevel 1 (
    goto run_frontend
)

if %TRY% GEQ %MAX_TRIES% (
    echo [Error] The backend is not responding after %MAX_TRIES% attempts.
    pause
    exit /b 1
)

timeout /t 2 > nul
goto check_loop

:run_frontend
cd /d "%FRONT_DIR%"
echo [Frontend]
start "Frontend" cmd /k npx next start -p 80

cd /d ..
echo [Info] Started
pause