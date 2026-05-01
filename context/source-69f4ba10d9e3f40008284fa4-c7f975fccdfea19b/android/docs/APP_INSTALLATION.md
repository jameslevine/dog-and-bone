# Dog and Bone - App Installation Guide

## Overview

Most Samsung Galaxy A12 devices come with many apps pre-installed but disabled. The setup script can **enable** these apps, but cannot **install** new apps.

For apps not pre-installed (like WhatsApp), they must be installed separately.

---

## Pre-Installed Apps (Just Need Enabling)

These apps are already on Samsung Galaxy A12 devices and just need to be enabled:

| App ID | Package Name | Pre-installed | Setup Script Action |
|--------|--------------|---------------|---------------------|
| `phone` | `com.samsung.android.dialer` | ✅ Yes | Enable |
| `sms` | `com.samsung.android.messaging` | ✅ Yes | Enable |
| `camera` | `com.sec.android.app.camera` | ✅ Yes | Enable |
| `gallery` | `com.sec.android.gallery3d` | ✅ Yes | Enable |
| `gmaps` | `com.google.android.apps.maps` | ✅ Yes | Enable |
| `calculator` | `com.sec.android.app.popupcalculator` | ✅ Yes | Enable |
| `alarm` | `com.sec.android.app.clockpackage` | ✅ Yes | Enable |
| `clock` | `com.sec.android.app.clockpackage` | ✅ Yes | Enable |
| `calendar` | `com.google.android.calendar` | ✅ Yes | Enable |
| `notes` | `com.samsung.android.app.notes` | ✅ Yes | Enable |
| `weather` | `com.samsung.android.weather` | ✅ Yes | Enable |
| `browser` | `com.sec.android.app.sbrowser` | ✅ Yes | Enable |
| `email` | `com.google.android.gm` | ✅ Yes | Enable |
| `steps` | `com.samsung.android.shealth` | ✅ Yes | Enable |

---

## Apps Requiring Manual Installation

These popular apps are NOT pre-installed on Samsung A12 and must be added:

### WhatsApp

**Package:** `com.whatsapp`

**Installation Methods:**

**Option 1: Via APK (Offline, No Google Account Needed)**
```bash
# Download WhatsApp APK
curl -L "https://www.whatsapp.com/android/current/WhatsApp.apk" -o whatsapp.apk

# Install via ADB
adb install whatsapp.apk

# Or download from: https://www.whatsapp.com/download
```

**Option 2: Via Play Store (Requires Google Account)**
- Open Play Store on device
- Search "WhatsApp"
- Install

**Option 3: Pre-downloaded APK Bundle**
- Keep a folder of trusted APKs: `android/apks/whatsapp.apk`
- Install during setup: `adb install android/apks/whatsapp.apk`

---

### Google Meet (Video Calling)

**Package:** `com.google.android.apps.meetings`

**Installation:**
```bash
# Play Store: "Google Meet"
# Or download APK from APKMirror (search "Google Meet")
adb install google-meet.apk
```

---

## Recommended Approach for Production

### Setup a Local APK Library

Create `android/apks/` directory with commonly requested apps:

```
android/apks/
├── whatsapp.apk
├── google-meet.apk
├── signal.apk
├── telegram.apk
├── spotify.apk
└── README.md (version notes)
```

**Update monthly** from official sources to ensure security.

---

## Enhanced Setup Script (Semi-Automated)

Update the setup script to check for and install missing apps:

```bash
# After Step 3 (Enable selected apps), add:

# --- Step 3.5: Install missing apps from APK library ---
echo ""
echo "Step 3.5/8: Installing missing apps from APK library..."

# Check if WhatsApp is needed but not installed
if echo "$SELECTED_APPS" | grep -q "whatsapp"; then
  if ! adb shell pm list packages | grep -q "com.whatsapp"; then
    echo "  📦 Installing WhatsApp..."
    if [ -f "apks/whatsapp.apk" ]; then
      adb install apks/whatsapp.apk
      echo "  ✅ WhatsApp installed"
    else
      echo "  ⚠️  WhatsApp APK not found. Download from https://www.whatsapp.com/download"
      echo "     Then: adb install whatsapp.apk"
    fi
  fi
fi

# Check if Google Meet is needed
if echo "$SELECTED_APPS" | grep -q "facetime-video"; then
  if ! adb shell pm list packages | grep -q "com.google.android.apps.meetings"; then
    echo "  📦 Installing Google Meet..."
    if [ -f "apks/google-meet.apk" ]; then
      adb install apks/google-meet.apk
      echo "  ✅ Google Meet installed"
    else
      echo "  ⚠️  Google Meet not available. Install from Play Store."
    fi
  fi
fi
```

---

## Verification Script

Check which apps from an order are actually installed:

```bash
#!/bin/bash
# check-apps.sh - Verify which apps are installed on device

APPS=(
  "com.whatsapp:WhatsApp"
  "com.google.android.apps.meetings:Google Meet"
  "com.google.android.gm:Gmail"
  "com.samsung.android.dialer:Phone"
  "com.samsung.android.messaging:Messages"
)

echo "Checking installed apps..."
echo ""

for app in "${APPS[@]}"; do
  package="${app%%:*}"
  name="${app##*:}"
  
  if adb shell pm list packages | grep -q "^package:$package$"; then
    status="✅ Installed"
    # Check if enabled
    if adb shell pm list packages -d | grep -q "^package:$package$"; then
      status="⚠️  Installed but DISABLED"
    fi
  else
    status="❌ NOT installed"
  fi
  
  printf "%-40s %s\n" "$name ($package)" "$status"
done
```

---

## Customer Communication

**In order confirmation email:**

"Your phone includes: Phone, SMS, Camera, Maps, [etc.]

**Apps requiring manual setup:**
- WhatsApp: Not pre-installed. Download from Settings → Google Play Store → Search 'WhatsApp'
- [Other non-standard apps]

Your phone is configured to only show the apps you selected. Additional apps cannot be accessed."

---

## Legal & Security Considerations

**✅ DO:**
- Download APKs from official sources (whatsapp.com, google.com)
- Verify APK signatures before installing
- Keep APKs updated monthly
- Document APK versions in a changelog

**❌ DON'T:**
- Download from untrusted sources
- Bundle modified/cracked APKs
- Violate app ToS by redistributing
- Use outdated APKs with known vulnerabilities

**Best Practice:**
- Install only from official websites or Play Store
- Document that some apps require Play Store (requires Google account)
- Offer to install common apps (WhatsApp, etc.) as a service add-on

---

## Summary

**Current Limitation:**
- Setup script can enable/disable pre-installed apps
- Cannot install new apps via ADB alone (no Play Store API)

**Recommended Solution:**
1. **Maintain APK library** for common requests (WhatsApp, Signal, Spotify)
2. **Update setup script** to check and install from library
3. **Document** which apps need Play Store
4. **Offer setup service** - pre-install requested apps before shipping

**For your test order:**
WhatsApp needs to be installed manually or via the APK library approach above.
