# Dog and Bone — Android Setup

This directory contains everything needed to configure a Samsung Galaxy A12 as a Dog and Bone minimalist phone.

---

## Overview

The setup process has four stages:

1. **Disable bloatware** — strip Samsung/carrier junk from every device
2. **Run the order setup script** — disable/enable apps per the customer's profile and selections
3. **Install the launcher** — replace the default Samsung home screen with the Dog and Bone launcher
4. **Push the launcher config** — tell the launcher which apps to show and which features to enable

---

## Prerequisites

### Hardware
- Samsung Galaxy A12 (tested on Android 11/12, One UI 3.x/4.x)
- USB cable (USB-C)
- Mac or Linux laptop running the scripts

### Software
- **Android Platform Tools** (includes `adb`)
  - macOS: `brew install android-platform-tools`
  - Linux: `sudo apt install adb`
  - Windows: Download from https://developer.android.com/tools/releases/platform-tools
- **Python 3** (for JSON parsing in `generate-order-script.sh`)
  - macOS: pre-installed or `brew install python3`
  - Linux: `sudo apt install python3`

### Phone setup (one-time per device)
1. Factory reset the phone.
2. Go through Android setup until you reach the home screen.
3. Enable **Developer Options**: Settings > About phone > tap "Software information" > tap "Build number" 7 times.
4. Go to Settings > Developer options > enable **USB debugging**.
5. Connect via USB. On the phone, tap **Allow** when prompted.
6. Verify connection: `adb devices` — the phone should show as `device` (not `unauthorized`).

---

## Step-by-Step Setup

### Step 1 — Connect and verify

```bash
adb devices
# Should output something like:
# List of devices attached
# RF8M12ABC1234   device
```

If the device shows as `unauthorized`, unlock the phone and tap **Allow** on the USB debugging prompt.

### Step 2 — Disable bloatware (every device)

```bash
bash android/scripts/disable-bloatware.sh
```

This disables Samsung Bixby, Samsung Free, gaming services, Facebook stubs, Microsoft pre-installs and carrier extras. All operations are reversible (`pm disable-user`).

### Step 3 — Generate the order setup script

**Option A: From Stripe order (admin web panel)**

Log in to the admin panel and use the "Generate Setup Script" button. This calls the Netlify function `generate-setup-script.ts` and downloads a ready-made `.sh` file.

**Option B: Offline from JSON file**

Create an `order.json`:

```json
{
  "orderId": "cs_test_a1b2c3",
  "profileId": "family",
  "apps": ["phone", "sms", "camera", "gmaps", "calculator", "alarm"]
}
```

Available `profileId` values: `essential`, `family`, `senior`, `balance`

Available `apps` IDs: `phone`, `sms`, `whatsapp`, `facetime-video`, `email`, `gmaps`, `camera`, `gallery`, `steps`, `calculator`, `alarm`, `clock`, `calendar`, `notes`, `weather`, `browser`

```bash
bash android/scripts/generate-order-script.sh order.json
# Outputs: order-cs_test_a1b2c3-setup.sh
```

### Step 4 — Run the order setup script

```bash
bash order-cs_test_a1b2c3-setup.sh
```

This script:
1. Sources `disable-bloatware.sh`
2. Disables all apps not in the customer's selection
3. Enables all apps that are in the selection
4. Installs the launcher APK (if built)
5. Pushes `app-config.json` to the device

### Step 5 — Install the launcher APK

If the APK is not built yet:

```bash
cd android/launcher
# Open in Android Studio or build with Gradle:
./gradlew assembleRelease
# APK will be at:
# app/build/outputs/apk/release/app-release.apk
```

Or install a pre-built APK:

```bash
adb install dog-and-bone-launcher.apk
```

### Step 6 — Set as default launcher

On the phone:
1. Settings > Apps > Default apps > Home app
2. Select **Dog and Bone**
3. Press the Home button to confirm

### Step 7 — Profile-specific finishing touches

**Family profile:**
- Open the launcher and follow the PIN setup prompt.
- Verify that no browser icon appears on the home screen.

**Senior profile:**
- Confirm the red emergency SOS button is visible.
- Pre-load emergency contacts in the Contacts app.
- Set the emergency number: edit `android/configs/senior-apps.txt` and re-push config.

**Balance profile:**
- Open Digital Wellbeing > Bedtime mode and set the evening schedule.
- Greyscale activates automatically at the configured time.

---

## File Structure

```
android/
├── README.md                          ← this file
├── scripts/
│   ├── disable-bloatware.sh           ← run on every device
│   ├── generate-order-script.sh       ← offline order script generator
│   └── templates/
│       ├── profile-essential.sh       ← Essential profile default app set
│       ├── profile-family.sh          ← Family profile default app set
│       ├── profile-senior.sh          ← Senior profile default app set
│       └── profile-balance.sh         ← Balance profile default app set
├── configs/
│   ├── samsung-a12-bloatware.txt      ← all packages disabled on every device
│   ├── essential-apps.txt             ← Essential profile package list
│   ├── family-apps.txt                ← Family profile package list
│   ├── senior-apps.txt                ← Senior profile package list
│   └── balance-apps.txt               ← Balance profile package list
└── launcher/                          ← Kotlin Android Studio project
    ├── build.gradle
    ├── settings.gradle
    └── app/
        ├── build.gradle
        └── src/main/
            ├── AndroidManifest.xml
            ├── assets/app-config.json
            ├── java/com/dogandbonephone/launcher/
            │   ├── MainActivity.kt
            │   ├── AppConfig.kt
            │   ├── AppGridAdapter.kt
            │   ├── PinLockManager.kt
            │   └── EmergencyButton.kt
            └── res/
                ├── layout/activity_main.xml
                └── values/
                    ├── colors.xml
                    ├── strings.xml
                    └── themes.xml
```

---

## Troubleshooting

### `adb: command not found`
Install Android Platform Tools. On macOS: `brew install android-platform-tools`.

### `no devices/emulators found`
- Check USB cable (try a different cable — some are charge-only).
- Ensure USB Debugging is enabled in Developer Options.
- On the phone, look for "Allow USB debugging?" prompt and tap Allow.
- Run `adb kill-server && adb start-server && adb devices`.

### `device unauthorized`
Unlock the phone, then tap **Allow** on the USB debugging dialog.

### Package not found / `pm disable-user` fails
Different A12 firmware versions ship different pre-installed apps. The scripts use `|| true` to skip missing packages — this is safe to ignore.

### Launcher not appearing in Default apps
Ensure the APK installed successfully: `adb shell pm list packages | grep dogandbonephone`. If it does not appear, the install failed — re-run `adb install -r dog-and-bone-launcher.apk`.

### Config not loading in launcher
The launcher reads from `assets/app-config.json` (bundled in the APK). If you need to update it post-install, rebuild the APK or push via:
```bash
adb push app-config.json /sdcard/Android/data/com.dogandbonephone.launcher/files/app-config.json
```
The launcher checks both locations at startup.

---

## Re-enabling packages (device reset / reversal)

All `pm disable-user` operations are reversible without a factory reset:

```bash
adb shell pm enable --user 0 <package.name>
```

To fully reset to stock, factory reset the device via Settings > General management > Reset > Factory data reset.
