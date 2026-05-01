#!/bin/bash
# ============================================================
# Dog and Bone — Family Profile Template
# Target: Parents & children
# Apps  : Calls, SMS, Camera, Gallery, Google Maps,
#         Calculator, Clock/Alarm, Contacts, Settings
# Notes :
#   - NO browser (not even Samsung Internet)
#   - NO YouTube, social media, or streaming
#   - NO app store access
#   - Parental PIN enforced by the launcher (pinEnabled: true)
#   - Emergency contact shortcut visible on home screen
#   - This template defines the DEFAULT selection.
#     generate-order-script.sh overrides with the
#     customer's actual selection from Stripe metadata.
# ============================================================

# --- Apps to ENABLE (Family defaults — same core as Essential) ---

adb shell pm enable --user 0 com.samsung.android.dialer        # Phone
adb shell pm enable --user 0 com.samsung.android.messaging     # Messages (SMS)
adb shell pm enable --user 0 com.sec.android.app.camera        # Camera
adb shell pm enable --user 0 com.sec.android.gallery3d         # Gallery
adb shell pm enable --user 0 com.google.android.apps.maps      # Google Maps
adb shell pm enable --user 0 com.sec.android.app.popupcalculator # Calculator
adb shell pm enable --user 0 com.sec.android.app.clockpackage  # Clock & Alarm
adb shell pm enable --user 0 com.android.contacts              # Contacts (system)
adb shell pm enable --user 0 com.samsung.android.contacts      # Samsung Contacts (may be present)
adb shell pm enable --user 0 com.android.settings              # Settings
adb shell pm enable --user 0 com.android.systemui              # System UI (always on)

# --- Apps to DISABLE (strictly blocked on Family profile) ---

# Browsers — MUST be disabled on Family profile
adb shell pm disable-user --user 0 com.sec.android.app.sbrowser           || true  # Samsung Internet
adb shell pm disable-user --user 0 com.android.chrome                     || true  # Chrome
adb shell pm disable-user --user 0 com.opera.browser                      || true  # Opera
adb shell pm disable-user --user 0 org.mozilla.firefox                    || true  # Firefox

# Social media
adb shell pm disable-user --user 0 com.facebook.katana                    || true
adb shell pm disable-user --user 0 com.instagram.android                  || true
adb shell pm disable-user --user 0 com.twitter.android                    || true
adb shell pm disable-user --user 0 com.snapchat.android                   || true
adb shell pm disable-user --user 0 com.zhiliaoapp.musically                || true  # TikTok
adb shell pm disable-user --user 0 com.ss.android.ugc.trill               || true  # TikTok (alt pkg)

# Streaming & entertainment
adb shell pm disable-user --user 0 com.google.android.youtube             || true
adb shell pm disable-user --user 0 com.netflix.mediaclient                || true
adb shell pm disable-user --user 0 com.spotify.music                      || true
adb shell pm disable-user --user 0 com.amazon.avod.thirdpartyclient       || true  # Amazon Prime Video
adb shell pm disable-user --user 0 com.google.android.play.games          || true  # Google Play Games

# Messaging extras (not in Family default — can be added via customisation)
adb shell pm disable-user --user 0 com.whatsapp                           || true
adb shell pm disable-user --user 0 com.google.android.apps.meetings       || true  # Google Meet
adb shell pm disable-user --user 0 com.google.android.talk                || true  # Hangouts

# Email
adb shell pm disable-user --user 0 com.google.android.gm                  || true  # Gmail
adb shell pm disable-user --user 0 com.samsung.android.email              || true

# Productivity extras
adb shell pm disable-user --user 0 com.google.android.calendar            || true
adb shell pm disable-user --user 0 com.samsung.android.app.notes          || true
adb shell pm disable-user --user 0 com.samsung.android.weather            || true

# Health
adb shell pm disable-user --user 0 com.samsung.android.shealth            || true

# App stores — prevent self-service installs
adb shell pm disable-user --user 0 com.sec.android.app.samsungapps        || true  # Galaxy Store
adb shell pm disable-user --user 0 com.samsung.android.galaxystore        || true
# NOTE: Google Play Store cannot be fully disabled via pm — use Screen Pinning or
#       a launcher that does not expose the Play Store icon.
