# Device Owner Mode Setup Guide

## What is Device Owner Mode?

Device Owner mode enables **full kiosk lockdown** on Android devices:
- ✅ Completely blocks notification shade
- ✅ Completely blocks status bar pull-down
- ✅ Blocks home button from exiting launcher
- ✅ Blocks recents/task switcher
- ✅ Prevents user from accessing other apps outside the launcher
- ✅ Cannot be disabled without factory reset

**This is the STRONGEST lock-down mode available on Android** (stronger than screen pinning).

---

## ⚠️ Critical Requirements

1. **Must be set BEFORE any Google account** is added to the device
2. **Requires factory-reset device** or newly unboxed device
3. **Can only be removed via factory reset**
4. **One Device Owner app per device** (cannot change without factory reset)

---

## Setup Process (Per Device)

### Step 1: Factory Reset the Phone

**On Samsung A12:**
```
Settings → General management → Reset → Factory data reset
```

OR hold **Power + Volume Up** during boot → Wipe data/factory reset

### Step 2: Complete Initial Setup (Skip Google Account!)

1. Go through Android setup wizard
2. **SKIP** Google account sign-in (critical!)
3. Skip Samsung account
4. Connect to Wi-Fi
5. Reach the home screen

### Step 3: Enable USB Debugging

```
Settings → About phone → Software information
Tap "Build number" 7 times
Go back → Developer options → USB debugging → Enable
```

### Step 4: Connect via USB and Verify

```bash
adb devices
# Should show: RF8M12ABC1234   device (not unauthorized)
```

If "unauthorized", unlock phone and tap "Allow" on USB debugging prompt.

### Step 5: Install the Launcher APK

```bash
adb install android/build-output/dog-and-bone-launcher-release-signed.apk
```

### Step 6: Set App as Device Owner

```bash
adb shell dpm set-device-owner com.dogandbonephone.launcher/.AdminReceiver
```

**Expected output:**
```
Success: Device owner set to package com.dogandbonephone.launcher
Active admin set to component {com.dogandbonephone.launcher/com.dogandbonephone.launcher.AdminReceiver}
```

**If you get an error:**
- **"Not allowed to set the device owner"** → Google account is added (factory reset required)
- **"Trying to set the device owner, but device owner is already set"** → Already configured (success!)
- **"AdminReceiver is not a device admin"** → Launcher not installed correctly

### Step 7: Launch the App

```bash
# Launch the launcher
adb shell am start -n com.dogandbonephone.launcher/.MainActivity
```

The launcher should start in full **lock-task kiosk mode** - home button will now do nothing!

### Step 8: Set as Default Home Launcher

On the phone:
```
Settings → Apps → Default apps → Home app → Dog and Bone → Always
```

After this, pressing Home will always go to Dog and Bone launcher.

---

## Testing Device Owner Mode

Once configured, test these lock-down features:

- [ ] Home button does nothing (stays in launcher)
- [ ] Back button does nothing
- [ ] Recents button does nothing
- [ ] Cannot pull down notification shade (completely blocked)
- [ ] Cannot pull down status bar
- [ ] Only configured apps are visible in launcher
- [ ] Launcher relaunches on boot
- [ ] System settings accessible (via Settings app in launcher)

---

## Removing Device Owner (Factory Reset Required)

There is **NO way to remove Device Owner mode without a factory reset**.

**To factory reset:**

```bash
# Option 1: Via ADB
adb shell recovery --wipe_data

# Option 2: On device
Settings → General management → Reset → Factory data reset

# Option 3: Hardware keys
Power off → Hold Power + Volume Up → Wipe data/factory reset
```

---

## Troubleshooting

### "Not allowed to set the device owner because there are already some accounts on the device"

**Solution:** Factory reset the device and **skip Google account** during setup.

### "AdminReceiver is not a device admin"

**Solution:**
1. Verify launcher is installed: `adb shell pm list packages | grep dogandbonephone`
2. Verify AdminReceiver in manifest: Should have `BIND_DEVICE_ADMIN` permission
3. Reinstall launcher APK

### Device Owner set, but home button still works

**Problem:** Device Owner is set but lock-task mode isn't activated.

**Solution:** The launcher's `MainActivity.onCreate()` calls `enableLockTaskIfDeviceOwner()` which:
1. Checks if app is Device Owner
2. Whitelists launcher package for lock-task
3. Calls `startLockTask()`

Check logs: `adb logcat | grep DogAndBone`

### Cannot access Settings to change Wi-Fi password

**Solution:** Include `com.android.settings` in the whitelisted apps (already done by default).

---

## Production Workflow

**For each customer device:**

1. Factory reset device
2. Skip Google account during setup
3. Enable USB debugging
4. Connect via USB
5. Run order setup script (disables bloatware, configures apps)
6. Install launcher APK
7. Set as Device Owner: `adb shell dpm set-device-owner com.dogandbonephone.launcher/.AdminReceiver`
8. Set as default home launcher
9. Test all features work
10. Ship device ✅

---

## Security & Support Implications

**Benefits:**
- ✅ Customer cannot accidentally exit the minimal phone experience
- ✅ No way to access hidden apps without factory reset
- ✅ Perfect for children's phones (Family profile)
- ✅ Perfect for elderly users (Senior profile)

**Risks:**
- ⚠️ Customer cannot remove lock without factory reset
- ⚠️ Support must be able to guide customers through factory reset if needed
- ⚠️ Cannot add Google account after Device Owner is set

**Best Practice:**
- Clearly document in user manual that factory reset removes all restrictions
- Provide support email/phone for customers who need help
- Test the factory reset process yourself before shipping

---

## Alternative: Standard Launcher Mode (No Device Owner)

If you want a **less locked-down** experience:

- Skip Step 6 (don't set Device Owner)
- Launcher still works as custom home
- Home button stays blocked via `onKeyDown`
- Notification shade IS accessible
- User can change default launcher in Settings

This is **safer for most users** who might need support access, but less secure for children/seniors.

---

## Summary Commands

```bash
# Check if Device Owner is set
adb shell dpm list-owners

# Remove Device Owner (if needed before factory reset)
adb shell dpm remove-active-admin com.dogandbonephone.launcher/.AdminReceiver

# Factory reset via ADB
adb shell recovery --wipe_data

# Launch launcher manually
adb shell am start -n com.dogandbonephone.launcher/.MainActivity
```

---

## Recommendation

**For Dog and Bone:**
- Use Device Owner mode for **Family** and **Senior** profiles (maximum safety)
- Consider standard mode for **Essential** and **Balance** profiles (more flexibility)
- Document the factory reset process clearly in customer materials
