@echo off
chcp 65001 > nul
echo ====================================
echo   Detter App 开发环境启动
echo ====================================
echo.

REM 检查是否在正确的目录
if not exist "package.json" (
    echo [错误] 请在DetterApp目录下运行此脚本
    pause
    exit /b 1
)

REM 检查Node.js是否安装
where node > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 检查是否有设备连接
echo [1/5] 检查Android设备...
adb devices
if %ERRORLEVEL% NEQ 0 (
    echo [警告] ADB未找到，请确保Android SDK已安装并配置环境变量
    echo.
)

REM 检查依赖是否安装
if not exist "node_modules" (
    echo [2/5] 安装依赖...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo [2/5] 依赖已安装，跳过
)

REM 启动Metro bundler
echo [3/5] 启动Metro bundler...
start "Detter Metro Bundler" cmd /k "title Detter Metro Bundler && npm start"

REM 等待Metro启动
echo [4/5] 等待Metro启动 (10秒)...
timeout /t 10 /nobreak > nul

REM 运行Android应用
echo [5/5] 启动Android应用...
echo.
echo 正在构建并安装应用到设备/模拟器...
echo 首次运行可能需要几分钟时间，请耐心等待...
echo.

call npm run android

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo   应用已成功启动！
    echo ====================================
    echo.
    echo 提示:
    echo - 修改代码后应用会自动刷新
    echo - 按 R 两次可手动刷新
    echo - 按 Ctrl+M 打开开发菜单
    echo - 关闭此窗口不会停止应用
    echo.
) else (
    echo.
    echo ====================================
    echo   应用启动失败
    echo ====================================
    echo.
    echo 请检查:
    echo 1. Android设备/模拟器是否正在运行
    echo 2. USB调试是否已启用
    echo 3. 查看上方错误信息
    echo.
)

pause
