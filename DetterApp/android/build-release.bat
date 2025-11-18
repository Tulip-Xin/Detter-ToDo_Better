@echo off
REM Script to build Detter Android release APK
REM This script performs pre-build checks and builds the release APK

setlocal enabledelayedexpansion

echo === Detter Android Release Build Script ===
echo.

REM Check if we're in the android directory
if not exist "build.gradle" (
    echo [ERROR] Please run this script from the android directory
    exit /b 1
)

echo [INFO] Starting pre-build checks...
echo.

REM Check 1: Verify keystore.properties exists
if not exist "keystore.properties" (
    echo [ERROR] keystore.properties not found!
    echo.
    echo [INFO] Please create keystore.properties with the following content:
    echo KEYSTORE_PASSWORD=your_keystore_password
    echo KEY_ALIAS=detter-release-key
    echo KEY_PASSWORD=your_key_password
    echo.
    echo [INFO] Or run generate-keystore.bat to create a new keystore
    exit /b 1
)
echo [OK] keystore.properties found

REM Check 2: Verify keystore file exists
if not exist "app\detter-release-key.keystore" (
    echo [WARNING] Release keystore not found, will use debug keystore
    echo [INFO] Run generate-keystore.bat to create a release keystore
) else (
    echo [OK] Release keystore found
)

REM Check 3: Verify Gradle wrapper exists
if not exist "gradlew.bat" (
    echo [ERROR] Gradle wrapper not found!
    exit /b 1
)
echo [OK] Gradle wrapper found

REM Check 4: Clean previous builds
echo [INFO] Cleaning previous builds...
call gradlew.bat clean
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Clean failed!
    exit /b 1
)
echo [OK] Clean completed

echo.
echo [INFO] Building release APK...
echo.

REM Build release APK
call gradlew.bat assembleRelease

REM Check if build was successful
if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Build completed successfully!
    echo.
    echo [INFO] APK files generated:
    dir /b app\build\outputs\apk\release\*.apk
    echo.
    echo [INFO] APK location: app\build\outputs\apk\release\
    echo.
    
    REM Show APK sizes
    echo [INFO] APK sizes:
    for %%f in (app\build\outputs\apk\release\*.apk) do (
        echo   - %%~nxf: %%~zf bytes
    )
    
    echo.
    echo [SUCCESS] Release build complete!
    echo [INFO] You can now install and test the APK on your device
) else (
    echo.
    echo [ERROR] Build failed!
    echo [INFO] Check the error messages above for details
    exit /b 1
)

pause
