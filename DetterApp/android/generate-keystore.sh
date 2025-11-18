#!/bin/bash

# Script to generate Android release keystore for Detter app
# This script should be run once to create the keystore file

echo "=== Detter Android Keystore Generator ==="
echo ""
echo "This script will generate a release keystore for signing your Android APK."
echo "Please provide the following information:"
echo ""

# Get keystore information from user
read -p "Enter keystore password (min 6 characters): " KEYSTORE_PASSWORD
read -p "Enter key alias (e.g., detter-release-key): " KEY_ALIAS
read -p "Enter key password (min 6 characters): " KEY_PASSWORD
read -p "Enter your full name: " FULL_NAME
read -p "Enter your organization (e.g., Detter Team): " ORGANIZATION
read -p "Enter your city: " CITY
read -p "Enter your state/province: " STATE
read -p "Enter your country code (e.g., CN): " COUNTRY

echo ""
echo "Generating keystore..."

# Generate keystore
keytool -genkeypair \
  -v \
  -storetype PKCS12 \
  -keystore ./app/detter-release-key.keystore \
  -alias "$KEY_ALIAS" \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "$KEYSTORE_PASSWORD" \
  -keypass "$KEY_PASSWORD" \
  -dname "CN=$FULL_NAME, OU=$ORGANIZATION, L=$CITY, ST=$STATE, C=$COUNTRY"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Keystore generated successfully!"
    echo ""
    echo "Keystore location: ./app/detter-release-key.keystore"
    echo ""
    echo "IMPORTANT: Save the following information securely!"
    echo "==========================================="
    echo "Keystore Password: $KEYSTORE_PASSWORD"
    echo "Key Alias: $KEY_ALIAS"
    echo "Key Password: $KEY_PASSWORD"
    echo "==========================================="
    echo ""
    echo "Next steps:"
    echo "1. Create a file named 'keystore.properties' in the android folder"
    echo "2. Add the following content to keystore.properties:"
    echo ""
    echo "KEYSTORE_PASSWORD=$KEYSTORE_PASSWORD"
    echo "KEY_ALIAS=$KEY_ALIAS"
    echo "KEY_PASSWORD=$KEY_PASSWORD"
    echo ""
    echo "3. Add 'keystore.properties' to .gitignore to keep credentials secure"
    echo "4. Run './gradlew assembleRelease' to build the signed APK"
else
    echo ""
    echo "✗ Failed to generate keystore"
    echo "Please make sure you have Java keytool installed"
fi
