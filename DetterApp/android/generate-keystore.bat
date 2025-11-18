@echo off
REM Script to generate Android release keystore for Detter app
REM This script should be run once to create the keystore file

echo === Detter Android Keystore Generator ===
echo.
echo This script will generate a release keystore for signing your Android APK.
echo Please provide the following information:
echo.

REM Get keystore information from user
set /p KEYSTORE_PASSWORD="Enter keystore password (min 6 characters): "
set /p KEY_ALIAS="Enter key alias (e.g., detter-release-key): "
set /p KEY_PASSWORD="Enter key password (min 6 characters): "
set /p FULL_NAME="Enter your full name: "
set /p ORGANIZATION="Enter your organization (e.g., Detter Team): "
set /p CITY="Enter your city: "
set /p STATE="Enter your state/province: "
set /p COUNTRY="Enter your country code (e.g., CN): "

echo.
echo Generating keystore...

REM Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore app\detter-release-key.keystore -alias %KEY_ALIAS% -keyalg RSA -keysize 2048 -validity 10000 -storepass %KEYSTORE_PASSWORD% -keypass %KEY_PASSWORD% -dname "CN=%FULL_NAME%, OU=%ORGANIZATION%, L=%CITY%, ST=%STATE%, C=%COUNTRY%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo Keystore generated successfully!
    echo.
    echo Keystore location: app\detter-release-key.keystore
    echo.
    echo IMPORTANT: Save the following information securely!
    echo ===========================================
    echo Keystore Password: %KEYSTORE_PASSWORD%
    echo Key Alias: %KEY_ALIAS%
    echo Key Password: %KEY_PASSWORD%
    echo ===========================================
    echo.
    echo Next steps:
    echo 1. Create a file named 'keystore.properties' in the android folder
    echo 2. Add the following content to keystore.properties:
    echo.
    echo KEYSTORE_PASSWORD=%KEYSTORE_PASSWORD%
    echo KEY_ALIAS=%KEY_ALIAS%
    echo KEY_PASSWORD=%KEY_PASSWORD%
    echo.
    echo 3. Add 'keystore.properties' to .gitignore to keep credentials secure
    echo 4. Run 'gradlew assembleRelease' to build the signed APK
) else (
    echo.
    echo Failed to generate keystore
    echo Please make sure you have Java keytool installed
)

pause
