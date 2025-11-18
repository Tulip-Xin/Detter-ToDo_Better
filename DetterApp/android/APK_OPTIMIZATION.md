# APK Size Optimization Guide

This document explains the optimizations applied to reduce the Detter Android APK size.

## Optimization Techniques Applied

### 1. ProGuard Code Minification

ProGuard is enabled in release builds to:
- Remove unused code
- Obfuscate class and method names
- Optimize bytecode
- Remove debug logging statements

**Configuration**: `android/app/proguard-rules.pro`

### 2. Resource Shrinking

Resource shrinking automatically removes unused resources from the APK:
- Unused layouts
- Unused drawables
- Unused strings
- Unused dimensions

**Enabled in**: `build.gradle` with `shrinkResources true`

### 3. ABI Splits

Separate APKs are generated for different CPU architectures:
- `armeabi-v7a` - 32-bit ARM devices
- `arm64-v8a` - 64-bit ARM devices (most modern Android devices)
- `x86` - 32-bit x86 devices (emulators)
- `x86_64` - 64-bit x86 devices (emulators)

This reduces APK size by ~75% per architecture.

**Result**: Instead of one 40MB universal APK, you get four ~10MB APKs.

### 4. Bundle Configuration

Android App Bundle (AAB) configuration enables:
- Language splits (only include user's language)
- Density splits (only include appropriate image densities)
- ABI splits (only include user's CPU architecture)

### 5. Hermes JavaScript Engine

Hermes is enabled by default in React Native 0.70+:
- Smaller APK size
- Faster app startup
- Lower memory usage

## Build Commands

### Build Release APK (with splits)
```bash
cd android
./gradlew assembleRelease
```

Output location:
```
android/app/build/outputs/apk/release/
├── detter-1.0.0-armeabi-v7a-release.apk
├── detter-1.0.0-arm64-v8a-release.apk
├── detter-1.0.0-x86-release.apk
└── detter-1.0.0-x86_64-release.apk
```

### Build Android App Bundle (AAB)
```bash
cd android
./gradlew bundleRelease
```

Output location:
```
android/app/build/outputs/bundle/release/app-release.aab
```

**Note**: AAB is required for Google Play Store uploads.

## Size Comparison

| Build Type | Size | Notes |
|------------|------|-------|
| Debug APK | ~50MB | No optimizations |
| Release APK (universal) | ~40MB | With ProGuard |
| Release APK (arm64-v8a) | ~10MB | With splits |
| Release AAB | ~25MB | Google Play optimizes further |

## Verification

### Check APK Size
```bash
ls -lh android/app/build/outputs/apk/release/
```

### Analyze APK Contents
```bash
# Using Android Studio
Build > Analyze APK...

# Or using command line
unzip -l app-release.apk
```

### Test ProGuard Rules
```bash
cd android
./gradlew assembleRelease --info
```

Look for ProGuard output in the logs.

## Additional Optimizations

### 1. Image Optimization
- Use WebP format instead of PNG/JPG
- Compress images before adding to project
- Use vector drawables (SVG) when possible

### 2. Remove Unused Dependencies
```bash
npm prune
```

### 3. Enable Hermes
Already enabled by default in React Native 0.70+

### 4. Use R8 Instead of ProGuard
R8 is the default in newer Android Gradle Plugin versions and provides better optimization.

## Troubleshooting

### ProGuard Errors
If you encounter ProGuard errors:
1. Check `proguard-rules.pro` for missing keep rules
2. Add specific keep rules for libraries causing issues
3. Use `-dontwarn` for unavoidable warnings

### App Crashes After ProGuard
1. Check crash logs for obfuscated class names
2. Add keep rules for classes mentioned in crashes
3. Test thoroughly before release

### Large APK Size
1. Run APK Analyzer to identify large files
2. Check for duplicate dependencies
3. Remove unused assets and resources
4. Consider using dynamic feature modules

## Best Practices

1. **Always test release builds** - ProGuard can cause runtime issues
2. **Keep mapping files** - Store `mapping.txt` for crash deobfuscation
3. **Use AAB for Play Store** - Google Play optimizes delivery
4. **Monitor APK size** - Set up CI/CD checks for size increases
5. **Profile before optimizing** - Use Android Profiler to identify bottlenecks

## Resources

- [Android Developer Guide - Shrink Your Code](https://developer.android.com/studio/build/shrink-code)
- [ProGuard Manual](https://www.guardsquare.com/manual/home)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)
- [Hermes Engine](https://hermesengine.dev/)

## Mapping Files

ProGuard generates mapping files for deobfuscating crash reports:

Location: `android/app/build/outputs/mapping/release/mapping.txt`

**IMPORTANT**: Save this file for each release to decode crash reports!
