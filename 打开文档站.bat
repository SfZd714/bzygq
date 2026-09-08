@echo off
chcp 65001 >nul
set "NPM_DIR=C:\Users\18584\.workbuddy\binaries\node\versions\22.22.2-2"
set "PATH=%NPM_DIR%;%PATH%"
cd /d "D:\学习资源\秋招\央国企指南手册\docs"
echo 正在启动文档站预览服务（VitePress preview, 端口 4173）...
start "" "http://localhost:4173"
call npm.cmd run docs:preview
pause
