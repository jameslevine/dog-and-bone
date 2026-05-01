# Dog and Bone Android Launcher - Quick Start

## 🚀 Build & Install (Debug APK for Testing)

```bash
# From the android/ directory
./build-launcher.sh

# Output: android/build-output/dog-and-bone-launcher-debug.apk (5.8MB)
```

**Install on device:**
```bash
adb install android/build-output/dog-and-bone-launcher-debug.apk
```

**Set as default launcher:**
- Settings → Apps → Default apps → Home app → Dog and Bone

---

## 🔐 Production Signing (One-Time Setup)

**Step 1: Create keystore** (only once, keep forever!)
```bash
cd android

keytool -genkey -v \
  -keystore dog-and-bone-release.keystore \
  -alias dog-and-bone \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Step 2: Create `keystore.properties`**
```properties
storeFile=dog-and-bone-release.keystore
storePassword=YOUR_SECURE_PASSWORD
keyAlias=dog-and-bone
keyPassword=YOUR_SECURE_PASSWORD
```

**Step 3: Sign release APK**
```bash
./sign-release.sh

# Output: android/build-output/dog-and-bone-launcher-release-signed.apk (4.7MB)
```

---

## 📱 Per-Order Deployment Workflow

When a customer orders a phone:

**Step 1: Get customer's app selection**
- From Stripe webhook metadata or admin dashboard
- Profile: `essential`, `family`, `senior`, or `balance`
- Apps: array of app IDs (e.g., `['phone', 'sms', 'camera', 'gmaps']`)

**Step 2: Generate ADB setup script**
```bash
# Via admin web interface or curl:
curl "https://yoursite.netlify.app/.netlify/functions/generate-setup-script?orderId=cs_xxx&secret=YOUR_ADMIN_SECRET" \
  -o order-cs_xxx-setup.sh
```

**Step 3: Configure device**
```bash
# Connect Samsung A12 via USB with USB Debugging enabled
chmod +x order-cs_xxx-setup.sh
./order-cs_xxx-setup.sh
```

This script will:
1. Disable all Samsung bloatware
2. Disable non-selected apps
3. Install the Dog and Bone launcher APK
4. Push profile-specific config to device
5. Set launcher as default home

**Step 4: Ship the phone** ✅

---

## 🎯 Profile Features

| Profile | Features |
|---------|----------|
| **Essential** | Basic apps only, no browser, no social media |
| **Family** | + PIN lock to prevent app changes |
| **Senior** | + Emergency SOS button, large text |
| **Balance** | + Browser with scheduled downtime |

---

## 🛠️ Customizing the Launcher

**Update app whitelist per profile:**
```bash
# Edit: android/configs/essential-apps.txt
# Edit: android/configs/family-apps.txt
# Edit: android/configs/senior-apps.txt
# Edit: android/configs/balance-apps.txt
```

**Modify launcher behavior:**
```kotlin
// Edit: android/launcher/app/src/main/java/com/dogandbonephone/launcher/MainActivity.kt
```

**Rebuild after changes:**
```bash
./build-launcher.sh
```

---

## 📖 Full Documentation

- **Signing Guide**: `android/docs/SIGNING.md`
- **ADB Scripts**: `android/README.md`
- **Deployment Guide**: `userInstructions/DEPLOYMENT.md`

---

## ⚡ Quick Commands Reference

```bash
# Build debug APK
./build-launcher.sh

# Sign release APK
./sign-release.sh

# Install on connected device
adb install android/build-output/dog-and-bone-launcher-debug.apk

# Reinstall (if already installed)
adb install -r android/build-output/dog-and-bone-launcher-debug.apk

# Uninstall from device
adb uninstall com.dogandbonephone.launcher

# Check connected devices
adb devices

# View device logs
adb logcat | grep DogAndBone
```

---

## 🐛 Troubleshooting

**"Device not found"**
- Enable USB Debugging: Settings → Developer options → USB debugging
- Approve USB debugging prompt on phone
- Try different USB cable (some are charge-only)

**"Gradle not found"**
- Wrapper should auto-download
- If fails: `brew install gradle`

**"jarsigner not found"**
- Install JDK: `brew install openjdk@17`

**"Launcher doesn't show"**
- Check it's installed: `adb shell pm list packages | grep dogandbonephone`
- Clear defaults: Settings → Apps → Default apps → Clear defaults
- Press Home button → Choose Dog and Bone → Always

---

## ✅ Testing Checklist

Before shipping a configured phone:

- [ ] Launcher starts on boot
- [ ] Only whitelisted apps visible
- [ ] All whitelisted apps launch correctly
- [ ] Back button doesn't exit launcher
- [ ] Recents button blocked (if Device Owner mode enabled)
- [ ] **Family profile**: PIN lock works
- [ ] **Senior profile**: Emergency button works
- [ ] Settings app accessible (for brightness, wifi, etc.)
- [ ] Phone can make/receive calls
- [ ] SMS works
- [ ] Camera works

---

## 🚨 Important Notes

**Keystore Security:**
- **Never lose the keystore** - can't update app without it
- **Never commit to Git** - already in .gitignore
- **Make encrypted backups** - multiple locations
- **Use strong passwords** - 20+ characters

**Device Owner Mode:**
- Enables full kiosk lockdown (blocks notification shade, recents)
- Requires factory reset to remove
- Set up before shipping phone
- Commands in `android/README.md`

**Support:**
- Launcher source: `android/launcher/app/src/main/java/com/dogandbonephone/launcher/`
- Issues: Document in project TASK_LOG.md
- Updates: Rebuild and re-sign with same keystore
