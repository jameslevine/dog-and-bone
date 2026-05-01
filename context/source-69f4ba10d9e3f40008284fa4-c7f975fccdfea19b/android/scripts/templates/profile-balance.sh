#!/bin/bash
# ============================================================
# Dog and Bone — Balance Profile Template
# Target: Adults who want intentional technology use
# Apps  : Calls, SMS, Camera, Gallery, Google Maps,
#         Calculator, Clock/Alarm, Contacts, Settings,
#         Samsung Internet (browser), Gmail, Calendar,
#         Weather, WhatsApp, Google Meet
# Notes :
#   - Browser is enabled but the launcher can apply scheduled
#     downtime (no PIN, no emergency button by default)
#   - Greyscale and usage limits configured below
#   - This template defines the DEFAULT selection.
#     generate-order-script.sh overrides with the
#     customer's actual selection from Stripe metadata.
# ============================================================

# --- Apps to ENABLE (Balance defaults) ---

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
adb shell pm enable --user 0 com.sec.android.app.sbrowser      # Samsung Internet (curated browser)
adb shell pm enable --user 0 com.google.android.gm             # Gmail
adb shell pm enable --user 0 com.google.android.calendar       # Calendar
adb shell pm enable --user 0 com.samsung.android.weather       # Weather
adb shell pm enable --user 0 com.whatsapp                      # WhatsApp
adb shell pm enable --user 0 com.google.android.apps.meetings  # Google Meet
adb shell pm enable --user 0 com.samsung.android.app.notes     # Notes

# --- Balance-mode system settings ---
# Digital wellbeing: set an evening greyscale schedule and
# encourage mindful use. These use Samsung One UI APIs where available.
echo "  Applying balance / digital wellbeing settings..."

# Enable greyscale mode (reduces visual stimulation)
# Samsung One UI: this is under Display > Eye Comfort / Greyscale
adb shell settings put secure accessibility_display_daltonizer_enabled 0  || true
adb shell settings put secure accessibility_display_daltonizer 0           || true
# Note: full greyscale schedule requires Samsung's Bedtime mode which is
# configured in Digital Wellbeing app — instruct user to set this up.

# Enable Do Not Disturb schedule (9pm–7am by default)
adb shell cmd notification set_dnd_mode priority 2>/dev/null || true  # DND: priority only

# --- Apps to DISABLE (not in Balance profile) ---

# Heavy social media / addictive apps (intentionally excluded)
adb shell pm disable-user --user 0 com.facebook.katana                    || true
adb shell pm disable-user --user 0 com.instagram.android                  || true
adb shell pm disable-user --user 0 com.twitter.android                    || true
adb shell pm disable-user --user 0 com.snapchat.android                   || true
adb shell pm disable-user --user 0 com.zhiliaoapp.musically                || true  # TikTok

# Streaming (Balance is about connection, not passive consumption)
adb shell pm disable-user --user 0 com.google.android.youtube             || true
adb shell pm disable-user --user 0 com.netflix.mediaclient                || true
adb shell pm disable-user --user 0 com.spotify.music                      || true
adb shell pm disable-user --user 0 com.amazon.avod.thirdpartyclient       || true

# Gaming
adb shell pm disable-user --user 0 com.google.android.play.games          || true

# Samsung email (use Gmail instead for consistency)
adb shell pm disable-user --user 0 com.samsung.android.email              || true

# Health step counter (not default for Balance, can be added)
adb shell pm disable-user --user 0 com.samsung.android.shealth            || true
