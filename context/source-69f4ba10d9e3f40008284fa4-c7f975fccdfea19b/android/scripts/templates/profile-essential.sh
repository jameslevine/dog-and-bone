#!/bin/bash
# ============================================================
# Dog and Bone — Essential Profile Template
# Target: Adults doing a digital detox
# Apps  : Calls, SMS, Camera, Gallery, Google Maps,
#         Calculator, Clock/Alarm, Contacts, Settings
# Notes : No browser, no social media, no streaming.
#         This template defines the DEFAULT selection.
#         generate-order-script.sh overrides with the
#         customer's actual selection from Stripe metadata.
# ============================================================

# --- Apps to ENABLE (Essential defaults) ---

adb shell pm enable --user 0 com.samsung.android.dialer        # Phone
adb shell pm enable --user 0 com.samsung.android.messaging     # Messages (SMS)
adb shell pm enable --user 0 com.sec.android.app.camera        # Camera
adb shell pm enable --user 0 com.sec.android.gallery3d         # Gallery
adb shell pm enable --user 0 com.google.android.apps.maps      # Google Maps
adb shell pm enable --user 0 com.sec.android.app.popupcalculator # Calculator
adb shell pm enable --user 0 com.sec.android.app.clockpackage  # Clock & Alarm
adb shell pm enable --user 0 com.android.contacts              # Contacts (system)
adb shell pm enable --user 0 com.samsung.android.contacts      # Samsung Contacts (may be present)
adb shell pm enable --user 0 com.android.settings              # Settings (always on)
adb shell pm enable --user 0 com.android.systemui              # System UI (always on)

# --- Apps to DISABLE (not in Essential profile) ---

# Communication extras
adb shell pm disable-user --user 0 com.whatsapp                           || true
adb shell pm disable-user --user 0 com.google.android.apps.meetings       || true  # Google Meet
adb shell pm disable-user --user 0 com.google.android.gm                  || true  # Gmail
adb shell pm disable-user --user 0 com.samsung.android.email              || true  # Samsung Email

# Browser
adb shell pm disable-user --user 0 com.sec.android.app.sbrowser           || true  # Samsung Internet
adb shell pm disable-user --user 0 com.android.chrome                     || true  # Chrome

# Social / streaming
adb shell pm disable-user --user 0 com.google.android.youtube             || true
adb shell pm disable-user --user 0 com.netflix.mediaclient                || true
adb shell pm disable-user --user 0 com.spotify.music                      || true
adb shell pm disable-user --user 0 com.facebook.katana                    || true
adb shell pm disable-user --user 0 com.instagram.android                  || true
adb shell pm disable-user --user 0 com.twitter.android                    || true

# Productivity extras (not in Essential)
adb shell pm disable-user --user 0 com.google.android.calendar            || true
adb shell pm disable-user --user 0 com.samsung.android.app.notes          || true
adb shell pm disable-user --user 0 com.samsung.android.weather            || true

# Health
adb shell pm disable-user --user 0 com.samsung.android.shealth            || true

# Samsung Store / extras
adb shell pm disable-user --user 0 com.sec.android.app.samsungapps        || true  # Galaxy Store
adb shell pm disable-user --user 0 com.samsung.android.galaxystore        || true
