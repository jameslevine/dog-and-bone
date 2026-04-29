#!/usr/bin/env bash
set -euo pipefail

# Dog and Bone Android Launcher Build Script
# Builds the launcher APK for installation on Samsung Galaxy A12 devices

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LAUNCHER_DIR="$SCRIPT_DIR/launcher"
OUTPUT_DIR="$SCRIPT_DIR/build-output"

echo "🦴 Dog and Bone - Android Launcher Builder"
echo "=========================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v java &> /dev/null; then
    echo "❌ Java not found. Install with: brew install openjdk@17"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -n 1 | awk -F '"' '{print $2}')
echo "✅ Java version: $JAVA_VERSION"

# Check if Gradle wrapper exists
if [ ! -f "$LAUNCHER_DIR/gradlew" ]; then
    echo "❌ Gradle wrapper not found at $LAUNCHER_DIR/gradlew"
    exit 1
fi

# Make gradlew executable
chmod +x "$LAUNCHER_DIR/gradlew"

# Check if Android SDK is available (optional, Gradle will download if needed)
if [ -n "${ANDROID_HOME:-}" ]; then
    echo "✅ ANDROID_HOME: $ANDROID_HOME"
else
    echo "⚠️  ANDROID_HOME not set (Gradle will download SDK components)"
fi

echo ""
echo "🏗️  Building Android Launcher APK..."
echo "   Location: $LAUNCHER_DIR"
echo ""

cd "$LAUNCHER_DIR"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
./gradlew clean || {
    echo ""
    echo "❌ Clean failed. Trying to fix Gradle wrapper..."

    # Download Gradle wrapper if missing
    if [ ! -f "gradle/wrapper/gradle-wrapper.jar" ]; then
        echo "📥 Downloading Gradle wrapper..."
        mkdir -p gradle/wrapper
        curl -L -o gradle/wrapper/gradle-wrapper.jar \
            https://raw.githubusercontent.com/gradle/gradle/master/gradle/wrapper/gradle-wrapper.jar
    fi

    # Retry clean
    ./gradlew clean
}

# Build debug APK (unsigned, for testing)
echo ""
echo "🔨 Building DEBUG APK..."
./gradlew assembleDebug

# Check if build succeeded
DEBUG_APK="$LAUNCHER_DIR/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$DEBUG_APK" ]; then
    echo ""
    echo "✅ DEBUG APK built successfully!"
    echo "   Location: $DEBUG_APK"

    # Copy to output directory
    mkdir -p "$OUTPUT_DIR"
    cp "$DEBUG_APK" "$OUTPUT_DIR/dog-and-bone-launcher-debug.apk"

    APK_SIZE=$(du -h "$DEBUG_APK" | cut -f1)
    echo "   Size: $APK_SIZE"
    echo "   Copied to: $OUTPUT_DIR/dog-and-bone-launcher-debug.apk"
else
    echo "❌ Debug APK not found. Build may have failed."
    exit 1
fi

# Build release APK (requires signing)
echo ""
echo "🔨 Building RELEASE APK (unsigned)..."
./gradlew assembleRelease || {
    echo "⚠️  Release build failed (expected if no signing key configured)"
    echo "   Debug APK is ready for testing!"
    exit 0
}

# Check if release build succeeded
RELEASE_APK="$LAUNCHER_DIR/app/build/outputs/apk/release/app-release-unsigned.apk"
if [ -f "$RELEASE_APK" ]; then
    echo ""
    echo "✅ RELEASE APK built successfully!"
    echo "   Location: $RELEASE_APK"

    cp "$RELEASE_APK" "$OUTPUT_DIR/dog-and-bone-launcher-release-unsigned.apk"

    APK_SIZE=$(du -h "$RELEASE_APK" | cut -f1)
    echo "   Size: $APK_SIZE"
    echo "   Copied to: $OUTPUT_DIR/dog-and-bone-launcher-release-unsigned.apk"
    echo ""
    echo "⚠️  This release APK is UNSIGNED and cannot be installed."
    echo "   For production, you need to sign it with a keystore."
fi

echo ""
echo "=========================================="
echo "✅ Build Complete!"
echo ""
echo "📦 Output APKs:"
ls -lh "$OUTPUT_DIR"/*.apk 2>/dev/null || true
echo ""
echo "📱 Next Steps:"
echo "   1. Connect Samsung A12 via USB"
echo "   2. Enable USB Debugging on the phone"
echo "   3. Install: adb install $OUTPUT_DIR/dog-and-bone-launcher-debug.apk"
echo "   4. Set as default launcher: Settings → Apps → Default apps → Home app"
echo ""
echo "🔐 For production signing, see: android/docs/SIGNING.md"
echo ""
