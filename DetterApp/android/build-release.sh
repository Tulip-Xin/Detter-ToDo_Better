#!/bin/bash

# Script to build Detter Android release APK
# This script performs pre-build checks and builds the release APK

set -e  # Exit on error

echo "=== Detter Android Release Build Script ==="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo "ℹ $1"
}

# Check if we're in the android directory
if [ ! -f "build.gradle" ]; then
    print_error "Please run this script from the android directory"
    exit 1
fi

print_info "Starting pre-build checks..."
echo ""

# Check 1: Verify keystore.properties exists
if [ ! -f "keystore.properties" ]; then
    print_error "keystore.properties not found!"
    echo ""
    print_info "Please create keystore.properties with the following content:"
    echo "KEYSTORE_PASSWORD=your_keystore_password"
    echo "KEY_ALIAS=detter-release-key"
    echo "KEY_PASSWORD=your_key_password"
    echo ""
    print_info "Or run generate-keystore.sh to create a new keystore"
    exit 1
fi
print_success "keystore.properties found"

# Check 2: Verify keystore file exists
if [ ! -f "app/detter-release-key.keystore" ]; then
    print_warning "Release keystore not found, will use debug keystore"
    print_info "Run generate-keystore.sh to create a release keystore"
else
    print_success "Release keystore found"
fi

# Check 3: Verify Gradle wrapper exists
if [ ! -f "gradlew" ]; then
    print_error "Gradle wrapper not found!"
    exit 1
fi
print_success "Gradle wrapper found"

# Check 4: Clean previous builds
print_info "Cleaning previous builds..."
./gradlew clean
print_success "Clean completed"

echo ""
print_info "Building release APK..."
echo ""

# Build release APK
./gradlew assembleRelease

# Check if build was successful
if [ $? -eq 0 ]; then
    echo ""
    print_success "Build completed successfully!"
    echo ""
    print_info "APK files generated:"
    ls -lh app/build/outputs/apk/release/*.apk
    echo ""
    print_info "APK location: app/build/outputs/apk/release/"
    echo ""
    
    # Show APK sizes
    print_info "APK sizes:"
    for apk in app/build/outputs/apk/release/*.apk; do
        size=$(du -h "$apk" | cut -f1)
        filename=$(basename "$apk")
        echo "  - $filename: $size"
    done
    
    echo ""
    print_success "Release build complete!"
    print_info "You can now install and test the APK on your device"
else
    echo ""
    print_error "Build failed!"
    print_info "Check the error messages above for details"
    exit 1
fi
