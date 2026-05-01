#!/usr/bin/env bash
set -euo pipefail

# Dog and Bone - Test All 4 Profiles
# Tests each profile configuration on connected device

echo "🐕 Dog and Bone - Profile Testing Suite"
echo "========================================"
echo ""

# Check device
if ! adb devices | grep -q "device$"; then
  echo "❌ No device connected. Enable USB debugging and connect device."
  exit 1
fi

DEVICE=$(adb get-serialno)
echo "✅ Device: $DEVICE"
echo ""

# Create test configs directory
mkdir -p /tmp/dog-and-bone-test-configs

# ===== TEST 1: ESSENTIAL PROFILE =====
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 1/4: ESSENTIAL Profile"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > /tmp/dog-and-bone-test-configs/essential.json << 'EOF'
{
  "profile": "essential",
  "apps": [
    "com.samsung.android.dialer",
    "com.samsung.android.messaging",
    "com.sec.android.app.camera",
    "com.sec.android.gallery3d",
    "com.google.android.apps.maps"
  ],
  "showEmergencyButton": false,
  "pinEnabled": false,
  "emergencyNumber": "",
  "largeText": false
}
EOF

adb push /tmp/dog-and-bone-test-configs/essential.json /sdcard/Android/data/com.dogandbonephone.launcher/files/app-config.json
adb shell am force-stop com.dogandbonephone.launcher
sleep 1
adb shell am start -n com.dogandbonephone.launcher/.MainActivity

echo ""
echo "✅ Essential profile loaded"
echo "📱 CHECK ON DEVICE:"
echo "   - 5 apps visible: Phone, Messages, Camera, Gallery, Maps"
echo "   - No Emergency SOS button"
echo "   - Normal text size"
echo ""
read -p "Press Enter when you've verified Essential profile works..."

# ===== TEST 2: FAMILY PROFILE =====
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 2/4: FAMILY Profile (PIN Lock)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > /tmp/dog-and-bone-test-configs/family.json << 'EOF'
{
  "profile": "family",
  "apps": [
    "com.samsung.android.dialer",
    "com.samsung.android.messaging",
    "com.sec.android.app.camera",
    "com.sec.android.gallery3d",
    "com.google.android.apps.maps"
  ],
  "showEmergencyButton": false,
  "pinEnabled": true,
  "emergencyNumber": "",
  "largeText": false
}
EOF

adb push /tmp/dog-and-bone-test-configs/family.json /sdcard/Android/data/com.dogandbonephone.launcher/files/app-config.json
adb shell am force-stop com.dogandbonephone.launcher
sleep 1
adb shell am start -n com.dogandbonephone.launcher/.MainActivity

echo ""
echo "✅ Family profile loaded"
echo "📱 CHECK ON DEVICE:"
echo "   - 5 apps visible: Phone, Messages, Camera, Gallery, Maps"
echo "   - PIN setup prompt should appear on first launch"
echo "   - Set a test PIN (e.g., 1234)"
echo "   - No Emergency SOS button"
echo ""
read -p "Press Enter when you've verified Family profile and set PIN..."

# ===== TEST 3: SENIOR PROFILE =====
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 3/4: SENIOR Profile (Large Text + SOS)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > /tmp/dog-and-bone-test-configs/senior.json << 'EOF'
{
  "profile": "senior",
  "apps": [
    "com.samsung.android.dialer",
    "com.samsung.android.messaging",
    "com.sec.android.app.camera",
    "com.sec.android.gallery3d",
    "com.google.android.apps.maps"
  ],
  "showEmergencyButton": true,
  "pinEnabled": false,
  "emergencyNumber": "999",
  "largeText": true
}
EOF

adb push /tmp/dog-and-bone-test-configs/senior.json /sdcard/Android/data/com.dogandbonephone.launcher/files/app-config.json
adb shell am force-stop com.dogandbonephone.launcher
sleep 1
adb shell am start -n com.dogandbonephone.launcher/.MainActivity

echo ""
echo "✅ Senior profile loaded"
echo "📱 CHECK ON DEVICE:"
echo "   - 5 apps visible: Phone, Messages, Camera, Gallery, Maps"
echo "   - Text is LARGER (1.3x scale)"
echo "   - Red EMERGENCY SOS button at bottom"
echo "   - Tap SOS button → should call 999"
echo ""
read -p "Press Enter when you've verified Senior profile..."

# ===== TEST 4: BALANCE PROFILE =====
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Test 4/4: BALANCE Profile (Browser)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > /tmp/dog-and-bone-test-configs/balance.json << 'EOF'
{
  "profile": "balance",
  "apps": [
    "com.samsung.android.dialer",
    "com.samsung.android.messaging",
    "com.sec.android.app.camera",
    "com.sec.android.gallery3d",
    "com.google.android.apps.maps",
    "com.sec.android.app.sbrowser"
  ],
  "showEmergencyButton": false,
  "pinEnabled": false,
  "emergencyNumber": "",
  "largeText": false
}
EOF

adb push /tmp/dog-and-bone-test-configs/balance.json /sdcard/Android/data/com.dogandbonephone.launcher/files/app-config.json
adb shell am force-stop com.dogandbonephone.launcher
sleep 1
adb shell am start -n com.dogandbonephone.launcher/.MainActivity

echo ""
echo "✅ Balance profile loaded"
echo "📱 CHECK ON DEVICE:"
echo "   - 6 apps visible: Phone, Messages, Camera, Gallery, Maps, Browser"
echo "   - Browser app should launch Samsung Internet"
echo "   - Normal text size"
echo "   - No Emergency SOS button"
echo ""
read -p "Press Enter when you've verified Balance profile..."

# ===== FINAL VERIFICATION =====
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All 4 Profiles Tested!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Final Lockdown Verification:"
echo "  1. Reboot device: adb reboot"
echo "  2. Launcher auto-starts"
echo "  3. Press Home button → BLOCKED"
echo "  4. Press Back in launcher → BLOCKED"
echo "  5. Open any app → Home still BLOCKED"
echo "  6. Notification shade → BLOCKED"
echo ""
echo "If all tests pass, all 4 profiles are production-ready! ✅"
echo ""
