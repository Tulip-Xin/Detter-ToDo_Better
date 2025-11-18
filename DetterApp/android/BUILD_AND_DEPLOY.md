# Detter Android Build and Deployment Guide

This guide covers the complete process of building, testing, and deploying the Detter Android app.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Building Release APK](#building-release-apk)
4. [Testing the APK](#testing-the-apk)
5. [Verification Checklist](#verification-checklist)
6. [Troubleshooting](#troubleshooting)
7. [Google Play Store Deployment](#google-play-store-deployment)

## Prerequisites

### Required Software

- **Node.js**: v16 or higher
- **Java Development Kit (JDK)**: v11 or higher
- **Android SDK**: API Level 28 or higher
- **Android Studio**: Latest version (optional but recommended)

### Environment Variables

Ensure the following are set:

```bash
# Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Java
export JAVA_HOME=/path/to/jdk
```

## Initial Setup

### 1. Install Dependencies

```bash
cd DetterApp
npm install
```

### 2. Generate Release Keystore

**On Windows:**
```bash
cd android
generate-keystore.bat
```

**On macOS/Linux:**
```bash
cd android
chmod +x generate-keystore.sh
./generate-keystore.sh
```

Follow the prompts to create your keystore.

### 3. Configure Keystore Properties

Create `android/keystore.properties`:

```properties
KEYSTORE_PASSWORD=your_keystore_password
KEY_ALIAS=detter-release-key
KEY_PASSWORD=your_key_password
```

**IMPORTANT**: Never commit this file to version control!

## Building Release APK

### Method 1: Using Build Script (Recommended)

**On Windows:**
```bash
cd android
build-release.bat
```

**On macOS/Linux:**
```bash
cd android
chmod +x build-release.sh
./build-release.sh
```

### Method 2: Manual Build

```bash
cd android

# Clean previous builds
./gradlew clean

# Build release APK
./gradlew assembleRelease
```

### Build Output

APK files will be generated at:
```
android/app/build/outputs/apk/release/
├── detter-1.0.0-armeabi-v7a-release.apk  (~10MB)
├── detter-1.0.0-arm64-v8a-release.apk   (~10MB)
├── detter-1.0.0-x86-release.apk         (~10MB)
└── detter-1.0.0-x86_64-release.apk      (~10MB)
```

**Note**: The `arm64-v8a` APK is suitable for most modern Android devices.

## Testing the APK

### 1. Install on Physical Device

#### Via USB (ADB)

```bash
# Enable USB debugging on your device
# Connect device via USB

# Install APK
adb install android/app/build/outputs/apk/release/detter-1.0.0-arm64-v8a-release.apk

# Or install all variants
adb install-multiple android/app/build/outputs/apk/release/*.apk
```

#### Via File Transfer

1. Copy the APK to your device
2. Open the APK file on your device
3. Allow installation from unknown sources if prompted
4. Install the app

### 2. Install on Emulator

```bash
# Start emulator
emulator -avd Your_AVD_Name

# Install APK
adb install android/app/build/outputs/apk/release/detter-1.0.0-x86_64-release.apk
```

### 3. Verify Installation

```bash
# Check if app is installed
adb shell pm list packages | grep com.detterapp

# Launch app
adb shell am start -n com.detterapp/.MainActivity
```

## Verification Checklist

Before releasing, verify the following:

### Functionality Tests

- [ ] App launches successfully
- [ ] All three tabs (�?�?�? are accessible
- [ ] Can create new tasks
- [ ] Can complete tasks
- [ ] Can add reflections
- [ ] Date selector works correctly
- [ ] Task priority containers work
- [ ] Swipe gestures work
- [ ] Drag and drop reordering works
- [ ] Search and filter work
- [ ] Data export works
- [ ] Data import works
- [ ] Theme switching works
- [ ] Notifications work (if enabled)

### Performance Tests

- [ ] App starts in < 2 seconds (cold start)
- [ ] UI interactions respond in < 100ms
- [ ] Scrolling is smooth (60fps)
- [ ] No memory leaks
- [ ] No crashes during normal use

### Permission Tests

- [ ] Storage permission requested when needed
- [ ] Notification permission requested when needed
- [ ] App handles permission denial gracefully

### Build Verification

- [ ] APK is signed with release keystore
- [ ] ProGuard is enabled
- [ ] Resources are shrunk
- [ ] APK size is optimized
- [ ] No debug logs in release build

### Verify APK Signature

```bash
# Check APK signature
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/detter-1.0.0-arm64-v8a-release.apk

# Should output: "jar verified"
```

### Analyze APK

```bash
# Using Android Studio
Build > Analyze APK... > Select your APK

# Check for:
# - APK size
# - Method count
# - Resource usage
# - Unused resources
```

## Troubleshooting

### Build Fails with "Keystore not found"

**Solution**: Ensure `keystore.properties` exists and contains correct paths.

### Build Fails with ProGuard Errors

**Solution**: Check `proguard-rules.pro` and add keep rules for problematic classes.

### App Crashes on Launch

**Possible causes**:
1. ProGuard removed required classes
2. Missing native libraries
3. Permission issues

**Solution**: 
- Check crash logs: `adb logcat`
- Add keep rules for crashed classes
- Test with ProGuard disabled first

### APK Size Too Large

**Solution**:
- Verify ProGuard is enabled
- Check for duplicate dependencies
- Use APK Analyzer to identify large files
- Ensure resource shrinking is enabled

### Installation Failed

**Solution**:
- Uninstall previous version: `adb uninstall com.detterapp`
- Check device storage space
- Verify APK architecture matches device

## Google Play Store Deployment

### 1. Build Android App Bundle (AAB)

```bash
cd android
./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### 2. Prepare Store Listing

Required assets:
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (at least 2, max 8)
- Short description (80 characters)
- Full description (4000 characters)
- Privacy policy URL

### 3. Upload to Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app or select existing
3. Navigate to Release > Production
4. Create new release
5. Upload AAB file
6. Fill in release notes
7. Review and rollout

### 4. Version Management

Update version in `android/app/build.gradle`:

```gradle
defaultConfig {
    versionCode 2        // Increment for each release
    versionName "1.0.1"  // Semantic versioning
}
```

## Best Practices

### Before Each Release

1. **Test thoroughly** on multiple devices
2. **Update version numbers** in build.gradle
3. **Update release notes** with changes
4. **Backup keystore** and passwords securely
5. **Save ProGuard mapping** files for crash reports
6. **Run security scan** (Play Console does this automatically)

### Security

- Never commit keystore files to git
- Never commit keystore.properties to git
- Store keystore backup in secure location
- Use strong passwords for keystore
- Enable two-factor authentication on Play Console

### Monitoring

After release:
- Monitor crash reports in Play Console
- Check user reviews and ratings
- Monitor app performance metrics
- Track installation and uninstallation rates

## Useful Commands

```bash
# Check app version on device
adb shell dumpsys package com.detterapp | grep versionName

# Clear app data
adb shell pm clear com.detterapp

# Uninstall app
adb uninstall com.detterapp

# View app logs
adb logcat | grep DetterApp

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png

# Record screen
adb shell screenrecord /sdcard/demo.mp4
adb pull /sdcard/demo.mp4
```

## Resources

- [Android Developer Guide](https://developer.android.com/)
- [React Native Documentation](https://reactnative.dev/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [ProGuard Manual](https://www.guardsquare.com/manual/home)

## Support

For issues or questions:
- Check the troubleshooting section above
- Review Android build logs
- Consult React Native documentation
- Check project GitHub issues

---

**Last Updated**: 2025
**Version**: 1.0.0
