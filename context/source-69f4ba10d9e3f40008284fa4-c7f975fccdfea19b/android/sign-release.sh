#!/usr/bin/env bash
set -euo pipefail

# Dog and Bone Android Launcher - Release APK Signing Script
# Signs the unsigned release APK with production keystore

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KEYSTORE_PROPS="$SCRIPT_DIR/keystore.properties"
UNSIGNED_APK="$SCRIPT_DIR/build-output/dog-and-bone-launcher-release-unsigned.apk"
SIGNED_APK="$SCRIPT_DIR/build-output/dog-and-bone-launcher-release-signed.apk"
ALIGNED_APK="$SCRIPT_DIR/build-output/dog-and-bone-launcher-release-aligned.apk"

echo "🔐 Dog and Bone - APK Signing Tool"
echo "===================================="
echo ""

# Check if unsigned APK exists
if [ ! -f "$UNSIGNED_APK" ]; then
    echo "❌ Unsigned release APK not found!"
    echo "   Expected: $UNSIGNED_APK"
    echo ""
    echo "   Run ./build-launcher.sh first to generate the unsigned APK."
    exit 1
fi

echo "✅ Found unsigned APK: $(basename "$UNSIGNED_APK")"
APK_SIZE=$(du -h "$UNSIGNED_APK" | cut -f1)
echo "   Size: $APK_SIZE"
echo ""

# Check if keystore.properties exists
if [ ! -f "$KEYSTORE_PROPS" ]; then
    echo "❌ Keystore properties not found!"
    echo "   Expected: $KEYSTORE_PROPS"
    echo ""
    echo "📖 To create a keystore, follow these steps:"
    echo ""
    echo "   1. Generate keystore:"
    echo "      keytool -genkey -v -keystore dog-and-bone-release.keystore \\"
    echo "        -alias dog-and-bone -keyalg RSA -keysize 2048 -validity 10000"
    echo ""
    echo "   2. Create keystore.properties in android/ with:"
    echo "      storeFile=dog-and-bone-release.keystore"
    echo "      storePassword=YOUR_PASSWORD"
    echo "      keyAlias=dog-and-bone"
    echo "      keyPassword=YOUR_PASSWORD"
    echo ""
    echo "   For full instructions: see android/docs/SIGNING.md"
    exit 1
fi

# Parse keystore properties
echo "📋 Reading keystore properties..."
STORE_FILE=$(grep "storeFile=" "$KEYSTORE_PROPS" | cut -d'=' -f2)
STORE_PASS=$(grep "storePassword=" "$KEYSTORE_PROPS" | cut -d'=' -f2)
KEY_ALIAS=$(grep "keyAlias=" "$KEYSTORE_PROPS" | cut -d'=' -f2)
KEY_PASS=$(grep "keyPassword=" "$KEYSTORE_PROPS" | cut -d'=' -f2)

# Resolve keystore path (may be relative)
if [[ "$STORE_FILE" == /* ]]; then
    KEYSTORE_PATH="$STORE_FILE"
else
    KEYSTORE_PATH="$SCRIPT_DIR/$STORE_FILE"
fi

if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "❌ Keystore file not found: $KEYSTORE_PATH"
    echo ""
    echo "   Check storeFile path in keystore.properties"
    exit 1
fi

echo "✅ Keystore: $(basename "$KEYSTORE_PATH")"
echo "✅ Key alias: $KEY_ALIAS"
echo ""

# Check if jarsigner is available
if ! command -v jarsigner &> /dev/null; then
    echo "❌ jarsigner not found!"
    echo "   This is part of the JDK. Make sure Java is installed."
    echo ""
    echo "   Install: brew install openjdk@17"
    exit 1
fi

# Check if ANDROID_HOME is set (for zipalign)
if [ -z "${ANDROID_HOME:-}" ]; then
    echo "⚠️  ANDROID_HOME not set. Trying to find Android SDK..."

    # Common Android SDK locations on macOS
    if [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME="$HOME/Library/Android/sdk"
        echo "✅ Found Android SDK: $ANDROID_HOME"
    else
        echo "❌ Android SDK not found!"
        echo "   Install Android Studio or set ANDROID_HOME manually"
        exit 1
    fi
fi

# Find zipalign
ZIPALIGN="$ANDROID_HOME/build-tools/34.0.0/zipalign"
if [ ! -f "$ZIPALIGN" ]; then
    # Try to find any zipalign version
    ZIPALIGN=$(find "$ANDROID_HOME/build-tools" -name "zipalign" -type f | head -n 1)
    if [ -z "$ZIPALIGN" ]; then
        echo "❌ zipalign not found in $ANDROID_HOME/build-tools"
        echo "   Install Android SDK build-tools"
        exit 1
    fi
fi

echo "✅ zipalign: $(basename "$(dirname "$ZIPALIGN")")"
echo ""

# Find apksigner
APKSIGNER="$ANDROID_HOME/build-tools/34.0.0/apksigner"
if [ ! -f "$APKSIGNER" ]; then
    # Try to find any apksigner version
    APKSIGNER=$(find "$ANDROID_HOME/build-tools" -name "apksigner" -type f | head -n 1)
    if [ -z "$APKSIGNER" ]; then
        echo "❌ apksigner not found in $ANDROID_HOME/build-tools"
        echo "   Install Android SDK build-tools"
        exit 1
    fi
fi

echo "✅ apksigner: $(basename "$(dirname "$APKSIGNER")")"
echo ""

# Step 1: Align the APK first (required before signing with apksigner)
echo "📦 Step 1: Aligning APK with zipalign..."
"$ZIPALIGN" -v -f 4 "$UNSIGNED_APK" "$ALIGNED_APK"

if [ $? -ne 0 ]; then
    echo "❌ Alignment failed!"
    exit 1
fi

echo ""
echo "✅ APK aligned successfully"
echo ""

# Step 2: Sign the aligned APK with apksigner (V1, V2, and V3 signatures)
echo "🔑 Step 2: Signing APK with apksigner (V2/V3 scheme)..."
"$APKSIGNER" sign \
  --ks "$KEYSTORE_PATH" \
  --ks-key-alias "$KEY_ALIAS" \
  --ks-pass "pass:$STORE_PASS" \
  --key-pass "pass:$KEY_PASS" \
  --out "$SIGNED_APK" \
  "$ALIGNED_APK"

if [ $? -ne 0 ]; then
    echo "❌ Signing failed!"
    exit 1
fi

echo ""
echo "✅ APK signed successfully with V1, V2, and V3 signatures"
echo ""

# Step 3: Verify signature
echo "🔍 Step 3: Verifying signature..."
"$APKSIGNER" verify --verbose "$SIGNED_APK"

if [ $? -eq 0 ]; then
    echo "✅ Signature verified!"
else
    echo "❌ Signature verification failed!"
    exit 1
fi

echo ""
echo "===================================="
echo "✅ Release APK Ready for Distribution!"
echo ""
echo "📦 Signed APK:"
echo "   $SIGNED_APK"
SIGNED_SIZE=$(du -h "$SIGNED_APK" | cut -f1)
echo "   Size: $SIGNED_SIZE"
echo ""
echo "📱 Installation:"
echo "   adb install $SIGNED_APK"
echo ""
echo "🚀 Next Steps:"
echo "   1. Test the signed APK on a real device"
echo "   2. Verify all features work (launcher, PIN lock, emergency button)"
echo "   3. Distribute to customers after order completion"
echo ""
echo "🔐 Security Reminder:"
echo "   - Keep your keystore file safe (encrypted backups)"
echo "   - Never commit keystore.properties to Git"
echo "   - Use the same keystore for all future updates"
echo ""
