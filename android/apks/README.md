# Dog and Bone - APK Library

This directory stores APK files for apps that are NOT pre-installed on Samsung Galaxy A12 devices.

## Required APKs

Place these APK files in this directory for automatic installation:

| App | Filename | Package | Download From |
|-----|----------|---------|---------------|
| WhatsApp | `whatsapp.apk` | com.whatsapp | https://www.whatsapp.com/android/current/WhatsApp.apk |
| Google Meet | `google-meet.apk` | com.google.android.apps.meetings | Play Store or APKPure |
| Signal | `signal.apk` | org.thoughtcrime.securesms | https://signal.org/android/apk/ |
| Telegram | `telegram.apk` | org.telegram.messenger | https://telegram.org/dl/android/apk |
| Spotify | `spotify.apk` | com.spotify.music | Play Store |

## Security Best Practices

✅ **DO:**
- Download from official sources only
- Verify APK signatures: `apksigner verify --print-certs whatsapp.apk`
- Update monthly to latest versions
- Keep version changelog below

❌ **DON'T:**
- Download from untrusted sites
- Use modified/cracked APKs
- Redistribute copyrighted apps commercially (check license)

## How It Works

The setup script checks if a requested app is installed:
- If YES → Enable it
- If NO → Try to install from this directory
- If APK missing → Log warning, continue

## Version Changelog

Track versions here for security auditing:

```
2026-04-30
- whatsapp.apk - Version 2.24.8.76 (downloaded from whatsapp.com)
- google-meet.apk - Version 231.0.0 (extracted from Play Store)
```

## Installation Test

Test if an APK installs correctly:

```bash
adb install -r apks/whatsapp.apk
adb shell pm list packages | grep whatsapp
```

## Legal Notice

These APKs are for internal device setup only. Ensure you comply with each app's
Terms of Service. Do not redistribute without permission from the app developers.
