#!/bin/bash
# ============================================================
# Dog and Bone — Senior Profile Template
# Target: Seniors, older adults
# Apps  : Calls, SMS, Camera, Gallery, Google Maps,
#         Calculator, Clock/Alarm, Contacts, Settings,
#         WhatsApp (video calls with family), Weather
# Notes :
#   - Emergency SOS floating button enabled (showEmergencyButton: true)
#   - Large text and icons configured via system settings below
#   - Emergency contacts should be pre-loaded before shipping
#   - This template defines the DEFAULT selection.
#     generate-order-script.sh overrides with the
#     customer's actual selection from Stripe metadata.
# ============================================================

# --- Apps to ENABLE (Senior defaults) ---

adb shell pm enable --user 0 com.samsung.android.dialer        # Phone
adb shell pm enable --user 0 com.samsung.android.messaging     # Messages (SMS)
adb shell pm enable --user 0 com.sec.android.app.camera        # Camera
adb shell pm enable --user 0 com.sec.android.gallery3d         # Gallery
adb shell pm enable --user 0 com.google.android.apps.maps      # Google Maps
adb shell pm enable --user 0 com.sec.android.app.popupcalculator # Calculator
adb shell pm enable --user 0 com.sec.android.app.clockpackage  # Clock & Alarm
adb shell pm enable --user 0 com.android.contacts              # Contacts (system)
adb shell pm enable --user 0 com.samsung.android.contacts      # Samsung Contacts
adb shell pm enable --user 0 com.android.settings              # Settings
adb shell pm enable --user 0 com.android.systemui              # System UI
adb shell pm enable --user 0 com.whatsapp                      # WhatsApp (family video calls)
adb shell pm enable --user 0 com.google.android.apps.meetings  # Google Meet (video calls)
adb shell pm enable --user 0 com.samsung.android.weather       # Weather

# --- Accessibility: large text and display size ---
# These settings make the phone easier to use for seniors.
echo "  Applying accessibility settings..."
adb shell settings put system font_scale 1.3          || true  # Large text (1.0 = default)
adb shell settings put secure accessibility_display_magnification_enabled 1 || true
adb shell settings put system screen_brightness 180   || true  # Brighter screen (0-255)

# --- Apps to DISABLE ---

# Browser
adb shell pm disable-user --user 0 com.sec.android.app.sbrowser           || true
adb shell pm disable-user --user 0 com.android.chrome                     || true

# Social media (confusion risk for seniors)
adb shell pm disable-user --user 0 com.facebook.katana                    || true
adb shell pm disable-user --user 0 com.instagram.android                  || true
adb shell pm disable-user --user 0 com.twitter.android                    || true
adb shell pm disable-user --user 0 com.snapchat.android                   || true
adb shell pm disable-user --user 0 com.zhiliaoapp.musically                || true

# Streaming / gaming
adb shell pm disable-user --user 0 com.google.android.youtube             || true
adb shell pm disable-user --user 0 com.netflix.mediaclient                || true
adb shell pm disable-user --user 0 com.spotify.music                      || true
adb shell pm disable-user --user 0 com.google.android.play.games          || true

# Email (not in Senior default — can be added via customisation)
adb shell pm disable-user --user 0 com.google.android.gm                  || true
adb shell pm disable-user --user 0 com.samsung.android.email              || true

# Productivity extras not needed
adb shell pm disable-user --user 0 com.google.android.calendar            || true
adb shell pm disable-user --user 0 com.samsung.android.app.notes          || true

# Health step counter (not default for seniors, can be added)
adb shell pm disable-user --user 0 com.samsung.android.shealth            || true

# App stores
adb shell pm disable-user --user 0 com.sec.android.app.samsungapps        || true
adb shell pm disable-user --user 0 com.samsung.android.galaxystore        || true

echo "  NOTE: Pre-load emergency contacts before shipping."
echo "  NOTE: Set emergency number in launcher app-config.json."
