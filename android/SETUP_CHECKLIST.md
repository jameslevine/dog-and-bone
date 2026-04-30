# Dog and Bone - Complete Device Setup Checklist

## ⚠️ CRITICAL: Must Factory Reset First

Device Owner mode (required for complete lockdown) can ONLY be set on devices with NO accounts.

---

## Step-by-Step Setup Process

### 1. Factory Reset Device
**On Samsung A12:**
- Settings → General management → Reset → Factory data reset
- OR: Hold Power + Volume Up during boot → Wipe data/factory reset

### 2. Initial Setup (SKIP ALL ACCOUNTS!)
- ✅ Select language
- ✅ Connect to Wi-Fi
- ❌ **SKIP** Google account sign-in (tap "Skip" or "Set up later")
- ❌ **SKIP** Samsung account
- ❌ **SKIP** Microsoft account
- ✅ Accept terms and finish setup

**CRITICAL:** If any account is added, Device Owner cannot be set (must factory reset again).

### 3. Enable USB Debugging
```
Settings → About phone → Software information
Tap "Build number" 7 times
Go back → Developer options → Enable USB debugging
```

### 4. Connect via USB
```bash
adb devices
# Should show: RZ8R60DV17N   device
```

If "unauthorized": Unlock phone and tap "Allow" on USB debugging prompt.

### 5. Install Launcher APK
```bash
cd /Users/james/Coding/Projects/minimalist-phone
adb install android/build-output/dog-and-bone-launcher-release-signed.apk
```

### 6. Set as Device Owner (THE CRITICAL STEP!)
```bash
adb shell dpm set-device-owner com.dogandbonephone.launcher/.AdminReceiver
```

**Expected output:**
```
Success: Device owner set to package com.dogandbonephone.launcher
Active admin set to component {com.dogandbonephone.launcher/com.dogandbonephone.launcher.AdminReceiver}
```

**If error:**
- "Not allowed to set device owner because there are already some accounts" → Factory reset and skip accounts
- "Trying to set the device owner, but device owner is already set" → Already done! Success!

### 7. Push Configuration (Senior Profile Example)
```bash
cat > /tmp/senior-config.json << 'CONFIG_EOF'
{
  "profile": "senior",
  "apps": [
    "com.samsung.android.dialer",
    "com.samsung.android.messaging",
    "com.sec.android.app.camera",
    "com.sec.android.gallery3d",
    "com.google.android.apps.maps",
    "com.sec.android.app.clockpackage",
    "com.android.contacts"
  ],
  "showEmergencyButton": true,
  "pinEnabled": false,
  "emergencyNumber": "999",
  "largeText": true
}
CONFIG_EOF

adb push /tmp/senior-config.json /sdcard/Android/data/com.dogandbonephone.launcher/files/app-config.json
```

### 8. Launch the Launcher
```bash
adb shell am start -n com.dogandbonephone.launcher/.MainActivity
```

### 9. Set as Default Home Launcher
**On the phone:**
- Settings → Apps → Default apps → Home app
- Select "Dog and Bone"
- Tap "Always"

### 10. Reboot and Test
```bash
adb reboot
```

**After reboot:**
- Dog and Bone launcher should auto-start
- Press Home button → NOTHING happens (locked in launcher)
- Press Back button → NOTHING happens
- Press Recents button → NOTHING happens
- Open any app → Cannot exit to another launcher

---

## ✅ Complete Lockdown Test Checklist

After Device Owner is set, verify:

- [ ] Launcher auto-starts on boot
- [ ] Home button does NOTHING (stays in launcher)
- [ ] Back button does NOTHING in launcher
- [ ] Recents button does NOTHING
- [ ] Cannot pull down notification shade (completely blocked)
- [ ] Cannot access status bar
- [ ] Apps in launcher work (Phone, SMS, Camera, etc.)
- [ ] When in an app, Home brings you back to Dog and Bone (not Samsung)
- [ ] Emergency SOS button visible and works (Senior)
- [ ] Large text mode active (Senior)
- [ ] PIN lock works (Family)

---

## 🚨 Important Notes

**Without Device Owner mode:**
- Home button still works → goes to Samsung launcher
- Users can exit and access other apps
- Boot receiver may not work consistently
- NOT suitable for production

**With Device Owner mode:**
- ✅ Complete kiosk lockdown
- ✅ No way out except factory reset
- ✅ Perfect for customers

**To Remove (if needed):**
- ONLY way is factory reset
- No software method to remove Device Owner

---

## 🎯 Quick Command Reference

```bash
# Check if Device Owner is set
adb shell dpm list-owners

# Check for accounts (must be empty)
adb shell dumpsys account | grep "Accounts:"

# Set Device Owner
adb shell dpm set-device-owner com.dogandbonephone.launcher/.AdminReceiver

# Remove Device Owner (only works if not locked)
adb shell dpm remove-active-admin com.dogandbonephone.launcher/.AdminReceiver

# Force stop launcher
adb shell am force-stop com.dogandbonephone.launcher

# Launch launcher
adb shell am start -n com.dogandbonephone.launcher/.MainActivity

# Reboot device
adb reboot

# Factory reset via ADB
adb shell recovery --wipe_data
```

---

## Production Workflow

For every customer device:

1. ✅ Factory reset
2. ✅ Skip all accounts during setup
3. ✅ Enable USB debugging
4. ✅ Run order setup script (disables bloatware)
5. ✅ Install signed launcher APK
6. ✅ Set as Device Owner ← CRITICAL STEP
7. ✅ Push customer-specific app-config.json
8. ✅ Set as default home launcher
9. ✅ Reboot and test
10. ✅ Ship device

Without step 6 (Device Owner), the device is NOT locked down properly.
