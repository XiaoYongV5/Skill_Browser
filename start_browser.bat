@echo off
cd /d "d:\AI Agent\产品设计\技能库"
start /b node server.js
timeout /t 2 >nul
start http://localhost:3000
exit
