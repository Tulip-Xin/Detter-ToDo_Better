@echo off
chcp 65001 > nul
echo ====================================
echo   Detter App 环境检查工具
echo ====================================
echo.

set ERROR_COUNT=0

REM 检查Node.js
echo [检查 1/6] Node.js
where node > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✓ Node.js 已安装: %NODE_VERSION%
) else (
    echo ✗ Node.js 未安装
    echo   下载地址: https://nodejs.org/
    set /a ERROR_COUNT+=1
)
echo.

REM 检查npm
echo [检查 2/6] npm
where npm > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✓ npm 已安装: %NPM_VERSION%
) else (
    echo ✗ npm 未安装
    set /a ERROR_COUNT+=1
)
echo.

REM 检查Java
echo [检查 3/6] Java JDK
where java > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('java -version 2^>^&1 ^| findstr /i "version"') do set JAVA_VERSION=%%i
    echo ✓ Java 已安装: %JAVA_VERSION%
) else (
    echo ✗ Java JDK 未安装
    echo   下载地址: https://www.oracle.com/java/technologies/downloads/
    set /a ERROR_COUNT+=1
)
echo.

REM 检查Android SDK
echo [检查 4/6] Android SDK
if defined ANDROID_HOME (
    if exist "%ANDROID_HOME%\platform-tools\adb.exe" (
        echo ✓ Android SDK 已配置: %ANDROID_HOME%
    ) else (
        echo ✗ ANDROID_HOME 已设置但路径无效
        set /a ERROR_COUNT+=1
    )
) else (
    echo ✗ ANDROID_HOME 环境变量未设置
    echo   请安装Android Studio并配置环境变量
    set /a ERROR_COUNT+=1
)
echo.

REM 检查ADB
echo [检查 5/6] ADB (Android Debug Bridge)
where adb > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('adb version 2^>^&1 ^| findstr /i "version"') do set ADB_VERSION=%%i
    echo ✓ ADB 已安装: %ADB_VERSION%
    
    REM 检查连接的设备
    echo.
    echo   连接的设备:
    adb devices | findstr /v "List"
) else (
    echo ✗ ADB 未找到
    echo   请确保 Android SDK platform-tools 在 PATH 中
    set /a ERROR_COUNT+=1
)
echo.

REM 检查项目依赖
echo [检查 6/6] 项目依赖
if exist "node_modules" (
    echo ✓ node_modules 已安装
) else (
    echo ⚠ node_modules 未安装
    echo   运行 'npm install' 安装依赖
)
echo.

REM 总结
echo ====================================
echo   检查完成
echo ====================================
echo.

if %ERROR_COUNT% EQU 0 (
    echo ✓ 所有必需组件已安装！
    echo.
    echo 你可以运行以下命令启动应用:
    echo   start-dev.bat
    echo.
    echo 或手动运行:
    echo   npm start        (启动Metro)
    echo   npm run android  (运行Android应用)
) else (
    echo ✗ 发现 %ERROR_COUNT% 个问题
    echo.
    echo 请安装缺失的组件后再试
    echo.
    echo 详细安装指南请查看:
    echo   WINDOWS_PREVIEW_GUIDE.md
)
echo.

pause
