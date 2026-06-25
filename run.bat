@echo off

net session >nul 2>&1
if %errorLevel% == 0 (
    goto :admin
) else (
    goto :elevate
)

:elevate
powershell -Command "Start-Process -FilePath '%0' -Verb RunAs"
exit

:admin
cd /d "%~dp0"

call npm run build
call pm2 start dist/index.js --name "hotspot-server"

pause
