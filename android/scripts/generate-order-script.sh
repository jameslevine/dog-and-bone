#!/bin/bash
# ============================================================
# Dog and Bone — Offline Order Script Generator
# Usage: bash generate-order-script.sh order.json
#
# order.json format:
# {
#   "orderId": "cs_test_xxx",
#   "profileId": "family",
#   "apps": ["phone", "sms", "camera", "whatsapp", "gmaps"]
# }
#
# Outputs: order-<orderId>-setup.sh
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATES_DIR="${SCRIPT_DIR}/templates"

# ---- Input validation ----

if [ $# -lt 1 ]; then
  echo "Usage: bash generate-order-script.sh <order.json>"
  echo ""
  echo "Example order.json:"
  echo '  {"orderId":"cs_test_xxx","profileId":"family","apps":["phone","sms","camera","gmaps"]}'
  exit 1
fi

ORDER_FILE="$1"

if [ ! -f "${ORDER_FILE}" ]; then
  echo "ERROR: File not found: ${ORDER_FILE}"
  exit 1
fi

if ! command -v python3 &>/dev/null; then
  echo "ERROR: python3 is required to parse JSON."
  echo "Install it with: brew install python3 (macOS) or sudo apt install python3 (Linux)"
  exit 1
fi

# ---- Parse JSON ----

echo "Parsing order file: ${ORDER_FILE}"

ORDER_ID=$(python3 -c "
import json, sys
with open('${ORDER_FILE}') as f:
    d = json.load(f)
if 'orderId' not in d:
    print('ERROR: missing orderId', file=sys.stderr)
    sys.exit(1)
print(d['orderId'])
")

PROFILE_ID=$(python3 -c "
import json, sys
with open('${ORDER_FILE}') as f:
    d = json.load(f)
if 'profileId' not in d:
    print('ERROR: missing profileId', file=sys.stderr)
    sys.exit(1)
print(d['profileId'])
")

APPS_CSV=$(python3 -c "
import json
with open('${ORDER_FILE}') as f:
    d = json.load(f)
print(','.join(d.get('apps', [])))
")

echo "  Order ID   : ${ORDER_ID}"
echo "  Profile    : ${PROFILE_ID}"
echo "  Apps       : ${APPS_CSV}"
echo ""

# ---- Validate profile ----

TEMPLATE_FILE="${TEMPLATES_DIR}/profile-${PROFILE_ID}.sh"
if [ ! -f "${TEMPLATE_FILE}" ]; then
  echo "ERROR: Unknown profile '${PROFILE_ID}'."
  echo "Available profiles: essential, family, senior, balance"
  exit 1
fi

# ---- App ID → package name map ----
# Must stay in sync with src/data/apps.ts

declare -A APP_TO_PKG
APP_TO_PKG["phone"]="com.samsung.android.dialer"
APP_TO_PKG["sms"]="com.samsung.android.messaging"
APP_TO_PKG["whatsapp"]="com.whatsapp"
APP_TO_PKG["facetime-video"]="com.google.android.apps.meetings"
APP_TO_PKG["email"]="com.google.android.gm"
APP_TO_PKG["gmaps"]="com.google.android.apps.maps"
APP_TO_PKG["camera"]="com.sec.android.app.camera"
APP_TO_PKG["gallery"]="com.sec.android.gallery3d"
APP_TO_PKG["steps"]="com.samsung.android.shealth"
APP_TO_PKG["calculator"]="com.sec.android.app.popupcalculator"
APP_TO_PKG["alarm"]="com.sec.android.app.clockpackage"
APP_TO_PKG["clock"]="com.sec.android.app.clockpackage"
APP_TO_PKG["calendar"]="com.google.android.calendar"
APP_TO_PKG["notes"]="com.samsung.android.app.notes"
APP_TO_PKG["weather"]="com.samsung.android.weather"
APP_TO_PKG["browser"]="com.sec.android.app.sbrowser"

# Full list of all known app IDs
ALL_APP_IDS=(phone sms whatsapp facetime-video email gmaps camera gallery steps calculator alarm clock calendar notes weather browser)

# ---- Build selected & non-selected package lists ----

IFS=',' read -ra SELECTED_IDS <<< "${APPS_CSV}"

# Collect selected packages (deduplicated — alarm and clock share a package)
declare -A SELECTED_PKGS
for app_id in "${SELECTED_IDS[@]}"; do
  app_id="$(echo "${app_id}" | xargs)"  # trim whitespace
  if [ -n "${app_id}" ] && [ -n "${APP_TO_PKG[${app_id}]:-}" ]; then
    SELECTED_PKGS["${APP_TO_PKG[$app_id]}"]=1
  fi
done

# Collect non-selected packages
declare -A NON_SELECTED_PKGS
for app_id in "${ALL_APP_IDS[@]}"; do
  pkg="${APP_TO_PKG[$app_id]}"
  if [ -z "${SELECTED_PKGS[$pkg]:-}" ]; then
    NON_SELECTED_PKGS["$pkg"]=1
  fi
done

# ---- Build disable lines ----
DISABLE_LINES=""
for pkg in "${!NON_SELECTED_PKGS[@]}"; do
  DISABLE_LINES="${DISABLE_LINES}  adb shell pm disable-user --user 0 ${pkg} || true\n"
done

# ---- Build enable lines ----
ENABLE_LINES=""
for pkg in "${!SELECTED_PKGS[@]}"; do
  ENABLE_LINES="${ENABLE_LINES}  adb shell pm enable --user 0 ${pkg}\n"
done

# ---- Determine launcher flags ----
PIN_ENABLED="false"
EMERGENCY_BUTTON="false"
if [ "${PROFILE_ID}" = "family" ]; then
  PIN_ENABLED="true"
fi
if [ "${PROFILE_ID}" = "senior" ]; then
  EMERGENCY_BUTTON="true"
fi

# ---- Output file ----

OUTPUT_FILE="order-${ORDER_ID}-setup.sh"
GENERATED_AT="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

cat > "${OUTPUT_FILE}" << SCRIPT_EOF
#!/bin/bash
# ============================================================
# Dog and Bone — Order Setup Script
# Order   : ${ORDER_ID}
# Profile : ${PROFILE_ID}
# Apps    : ${APPS_CSV}
# Generated: ${GENERATED_AT}
# ============================================================

set -euo pipefail

echo "============================================================"
echo " Dog and Bone Setup Script"
echo " Order  : ${ORDER_ID}"
echo " Profile: ${PROFILE_ID}"
echo "============================================================"
echo ""

# --- Preflight: check ADB ---
if ! command -v adb &>/dev/null; then
  echo "ERROR: adb not found in PATH."
  exit 1
fi

if ! adb devices | grep -q "device\$"; then
  echo "ERROR: No device connected. Enable USB Debugging and try again."
  exit 1
fi
echo "Device connected."
echo ""

# --- Step 1: Disable Samsung/carrier bloatware ---
echo "Step 1/4: Removing bloatware..."
BLOATWARE_SCRIPT="\$(dirname "\$0")/disable-bloatware.sh"
if [ -f "\${BLOATWARE_SCRIPT}" ]; then
  bash "\${BLOATWARE_SCRIPT}"
else
  echo "WARNING: disable-bloatware.sh not found alongside this script — skipping."
fi
echo ""

# --- Step 2: Disable non-selected apps ---
echo "Step 2/4: Disabling non-selected apps..."
$(printf "%b" "${DISABLE_LINES:-  echo '  (nothing to disable)'}")
echo "  Done."
echo ""

# --- Step 3: Enable selected apps ---
echo "Step 3/4: Enabling selected apps..."
$(printf "%b" "${ENABLE_LINES:-  echo '  (no apps selected)'}")
echo "  Done."
echo ""

# --- Step 4: Install Dog and Bone Launcher ---
echo "Step 4/4: Installing launcher..."
LAUNCHER_APK="\$(dirname "\$0")/../launcher/app/build/outputs/apk/release/app-release.apk"
if [ -f "\${LAUNCHER_APK}" ]; then
  echo "  Installing from build output..."
  adb install -r "\${LAUNCHER_APK}"
  echo "  Launcher installed."
else
  echo "  WARNING: Built APK not found at \${LAUNCHER_APK}"
  echo "  Download from: https://github.com/your-repo/releases"
  echo "  Then run: adb install dog-and-bone-launcher.apk"
fi
echo ""

# --- Step 5: Push launcher config ---
echo "Step 5/4: Pushing launcher config..."
CONFIG_JSON="\$(dirname "\$0")/order-${ORDER_ID}-config.json"

cat > "\${CONFIG_JSON}" << CONFIG_EOF
{
  "profile": "${PROFILE_ID}",
  "apps": [$(python3 -c "import json; ids=['${APPS_CSV//,/\',\'}'] ; pkgs={'phone':'com.samsung.android.dialer','sms':'com.samsung.android.messaging','whatsapp':'com.whatsapp','facetime-video':'com.google.android.apps.meetings','email':'com.google.android.gm','gmaps':'com.google.android.apps.maps','camera':'com.sec.android.app.camera','gallery':'com.sec.android.gallery3d','steps':'com.samsung.android.shealth','calculator':'com.sec.android.app.popupcalculator','alarm':'com.sec.android.app.clockpackage','clock':'com.sec.android.app.clockpackage','calendar':'com.google.android.calendar','notes':'com.samsung.android.app.notes','weather':'com.samsung.android.weather','browser':'com.sec.android.app.sbrowser'}; out=list(dict.fromkeys(pkgs[i] for i in ids if i in pkgs)); print(','.join('\"'+p+'\"' for p in out))")],
  "showEmergencyButton": ${EMERGENCY_BUTTON},
  "pinEnabled": ${PIN_ENABLED},
  "emergencyNumber": ""
}
CONFIG_EOF

adb push "\${CONFIG_JSON}" /sdcard/Android/data/com.dogandbonephone.launcher/files/app-config.json 2>/dev/null \
  || echo "  WARNING: Could not push config — launcher may not be installed yet."
rm -f "\${CONFIG_JSON}"
echo ""

echo "============================================================"
echo " Setup complete for order ${ORDER_ID}!"
echo ""
echo " Next steps:"
echo "   1. On the phone: go to Settings > Apps > Default apps"
echo "   2. Set 'Dog and Bone' as the Home app (launcher)"
if [ "${PIN_ENABLED}" = "true" ]; then
echo "   3. Open the launcher and set your parental PIN"
fi
echo "============================================================"
echo ""
SCRIPT_EOF

chmod +x "${OUTPUT_FILE}"

echo "============================================================"
echo " Generated: ${OUTPUT_FILE}"
echo " Run it with: bash ${OUTPUT_FILE}"
echo "============================================================"
echo ""
