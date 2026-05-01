#!/bin/bash
# ============================================================
# Dog and Bone — Samsung Galaxy A12 Bloatware Disabler
# Runs on EVERY device regardless of profile.
# Uses pm disable-user (reversible, no root required).
# ============================================================

set -euo pipefail

echo "============================================================"
echo " Dog and Bone — Disable Samsung A12 Bloatware"
echo "============================================================"
echo ""

# --- Preflight checks ---

if ! command -v adb &>/dev/null; then
  echo "ERROR: adb is not installed or not in PATH."
  echo "Install Android Platform Tools: https://developer.android.com/tools/releases/platform-tools"
  exit 1
fi

echo "Checking device connection..."
DEVICE_STATE=$(adb get-state 2>&1 || true)

if [ "$DEVICE_STATE" != "device" ]; then
  echo "ERROR: No device found (state: ${DEVICE_STATE})."
  echo "  1. Connect your Samsung Galaxy A12 via USB."
  echo "  2. Enable USB Debugging in Settings > Developer Options."
  echo "  3. Accept the 'Allow USB debugging' prompt on the phone."
  exit 1
fi

DEVICE_SERIAL=$(adb get-serialno)
echo "Device connected: ${DEVICE_SERIAL}"
echo ""

# Helper: disable a package, continue if package does not exist on this firmware
disable_pkg() {
  local pkg="$1"
  echo "  Disabling: ${pkg}"
  adb shell pm disable-user --user 0 "${pkg}" 2>/dev/null || true
}

# ---- Samsung Bixby ----
echo "Step 1/9: Disabling Bixby..."
disable_pkg "com.samsung.android.bixby.agent"
disable_pkg "com.samsung.android.bixby.wakeup"
disable_pkg "com.samsung.android.bixby.service"
disable_pkg "com.samsung.android.bixby.voiceinput"
disable_pkg "com.samsung.systemui.bixby2"
disable_pkg "com.samsung.android.voiceserviceplatform"
disable_pkg "com.samsung.android.visionintelligence"
echo "  Done."
echo ""

# ---- Samsung Free / Edge Panels / One UI extras ----
echo "Step 2/9: Disabling Samsung Free & Edge extras..."
disable_pkg "com.samsung.android.app.spage"
disable_pkg "com.samsung.android.app.cocktailbarservice"
disable_pkg "com.samsung.android.app.smartcapture"
disable_pkg "com.samsung.android.app.galaxyfinder"
disable_pkg "com.sec.android.easyonehand"
disable_pkg "com.samsung.android.app.tips"
echo "  Done."
echo ""

# ---- Samsung Gaming services ----
echo "Step 3/9: Disabling gaming services..."
disable_pkg "com.samsung.android.game.gamehome"
disable_pkg "com.samsung.android.game.gametools"
disable_pkg "com.samsung.android.game.gametools.watchdog"
disable_pkg "com.samsung.android.game.gos"
echo "  Done."
echo ""

# ---- Samsung Kids / Watch ----
echo "Step 4/9: Disabling Kids & Watch services..."
disable_pkg "com.samsung.android.kidsinstaller"
disable_pkg "com.samsung.android.app.watchmanagersam"
echo "  Done."
echo ""

# ---- Samsung Cloud / Backup ----
echo "Step 5/9: Disabling Samsung Cloud..."
disable_pkg "com.samsung.android.scloud"
disable_pkg "com.samsung.android.beaconmanager"
disable_pkg "com.samsung.android.bbc.bbcagent"
echo "  Done."
echo ""

# ---- Samsung AR / Stickers ----
echo "Step 6/9: Disabling AR & sticker apps..."
disable_pkg "com.samsung.android.arzone"
disable_pkg "com.samsung.android.aremoji"
disable_pkg "com.samsung.android.stickercenter"
echo "  Done."
echo ""

# ---- Microsoft pre-installs ----
echo "Step 7/9: Disabling Microsoft pre-installs..."
disable_pkg "com.microsoft.intune.mam"
disable_pkg "com.microsoft.launcher.enterprise"
echo "  Done."
echo ""

# ---- Facebook pre-installs ----
echo "Step 8/9: Disabling Facebook stubs..."
disable_pkg "com.facebook.appmanager"
disable_pkg "com.facebook.services"
disable_pkg "com.facebook.system"
echo "  Done."
echo ""

# ---- Google & carrier extras ----
echo "Step 9/10: Disabling Google & carrier extras..."
disable_pkg "com.google.android.youtube"
disable_pkg "com.google.android.apps.tachyon"
disable_pkg "com.google.android.music"
disable_pkg "com.google.android.videos"
disable_pkg "com.google.android.apps.googleassistant"
disable_pkg "com.google.android.apps.tycho"
disable_pkg "com.netflix.partner.activation"
echo "  Done."
echo ""

# ---- CRITICAL: Disable Samsung Launcher ----
echo "Step 10/10: Disabling Samsung default launcher (CRITICAL)..."
echo "  ⚠️  This prevents users from accessing Samsung launcher"
echo "  ⚠️  Dog and Bone will be the ONLY launcher on the device"
disable_pkg "com.sec.android.app.launcher"
echo "  Done."
echo ""

echo "============================================================"
echo " ✅ Bloatware removal complete."
echo " ✅ Samsung launcher disabled."
echo " ${DEVICE_SERIAL} is ready for Dog and Bone launcher installation."
echo "============================================================"
echo ""
