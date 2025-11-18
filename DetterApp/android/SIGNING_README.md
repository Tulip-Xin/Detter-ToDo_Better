# Android Release Signing Configuration

This document explains how to configure release signing for the Detter Android app.

## Prerequisites

- Java Development Kit (JDK) installed
- `keytool` command available in your PATH

## Step 1: Generate Release Keystore

### On Windows:
```bash
cd android
generate-keystore.bat
```

### On macOS/Linux:
```bash
cd android
chmod +x generate-keystore.sh
./generate-keystore.sh
```

The script will prompt you for:
- Keystore password (minimum 6 characters)
- Key alias (e.g., `detter-release-key`)
- Key password (minimum 6 characters)
- Your full name
- Organization name
- City
- State/Province
- Country code (e.g., `CN` for China)

## Step 2: Create keystore.properties

After generating the keystore, create a file named `keystore.properties` in the `android` folder:

```properties
KEYSTORE_PASSWORD=your_keystore_password
KEY_ALIAS=detter-release-key
KEY_PASSWORD=your_key_password
```

**IMPORTANT:** 
- Replace the placeholder values with your actual passwords
- Never commit `keystore.properties` to version control
- Keep your keystore file and passwords secure

## Step 3: Verify Configuration

The keystore file should be located at:
```
android/app/detter-release-key.keystore
```

The configuration file should be at:
```
android/keystore.properties
```

## Step 4: Build Release APK

Once configured, you can build a signed release APK:

```bash
cd android
./gradlew assembleRelease
```

The signed APK will be generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Manual Keystore Generation

If you prefer to generate the keystore manually:

```bash
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore app/detter-release-key.keystore \
  -alias detter-release-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

## Security Best Practices

1. **Backup Your Keystore**: Store the keystore file and passwords in a secure location
2. **Never Share**: Don't share your keystore or passwords with anyone
3. **Version Control**: Ensure `keystore.properties` and `*.keystore` files are in `.gitignore`
4. **CI/CD**: For automated builds, use environment variables or secure secret management

## Troubleshooting

### "keytool: command not found"
- Ensure Java JDK is installed
- Add Java bin directory to your PATH

### "Keystore was tampered with, or password was incorrect"
- Verify the passwords in `keystore.properties` match those used during generation
- Check for typos in the configuration file

### Build fails with signing error
- Verify `keystore.properties` exists in the `android` folder
- Ensure the keystore file path is correct
- Check that all required properties are set

## For Development

During development, the app uses the debug keystore automatically. You only need the release keystore for production builds.

## Keystore Information

- **Validity**: 10,000 days (~27 years)
- **Algorithm**: RSA
- **Key Size**: 2048 bits
- **Store Type**: PKCS12

## References

- [Android Developer Guide - Sign Your App](https://developer.android.com/studio/publish/app-signing)
- [React Native - Publishing to Google Play Store](https://reactnative.dev/docs/signed-apk-android)
