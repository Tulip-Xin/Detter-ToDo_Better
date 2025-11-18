# Release Checklist

Quick checklist for building and releasing Detter Android app.

## Pre-Build

- [ ] All features implemented and tested
- [ ] Code reviewed and merged to main branch
- [ ] Version number updated in `build.gradle`
- [ ] Release notes prepared
- [ ] Keystore and credentials ready

## Build Process

- [ ] Run `npm install` to ensure dependencies are up to date
- [ ] Run `./gradlew clean` to clean previous builds
- [ ] Run `./gradlew assembleRelease` or use build script
- [ ] Verify APK files generated successfully
- [ ] Check APK sizes are optimized

## Testing

- [ ] Install APK on physical device
- [ ] Test all core features
- [ ] Test permissions (storage, notifications)
- [ ] Test on different Android versions
- [ ] Verify no crashes or errors
- [ ] Check performance (startup time, scrolling)
- [ ] Test with ProGuard enabled

## Verification

- [ ] APK is signed with release keystore
- [ ] ProGuard mapping file saved
- [ ] APK size is acceptable
- [ ] No debug logs in release build
- [ ] All resources optimized

## Deployment

- [ ] Upload to Play Console (if applicable)
- [ ] Update store listing
- [ ] Submit for review
- [ ] Monitor crash reports after release

## Post-Release

- [ ] Tag release in git
- [ ] Backup keystore and mapping files
- [ ] Monitor user feedback
- [ ] Track installation metrics
