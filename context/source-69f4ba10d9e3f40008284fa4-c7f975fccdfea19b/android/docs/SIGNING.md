# Android APK Signing Guide

This guide covers how to sign the Dog and Bone launcher APK for production distribution.

## Why Signing Matters

- **Debug APKs** are signed with a debug key (auto-generated) - fine for testing
- **Release APKs** must be signed with your own keystore - required for production
- The same keystore must be used for all future updates (keep it safe!)
- If you lose the keystore, you cannot update the app - users must uninstall and reinstall

---

## One-Time Setup: Create Keystore

**Step 1: Generate a keystore**

```bash
keytool -genkey -v \
  -keystore dog-and-bone-release.keystore \
  -alias dog-and-bone \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  -dname "CN=Dog and Bone, OU=Mobile, O=Dog and Bone Ltd, L=London, ST=England, C=GB"
```

**Replace:**
- `YOUR_STORE_PASSWORD` - Strong password for the keystore file (e.g., `DogBone2026Secure!`)
- `YOUR_KEY_PASSWORD` - Strong password for the signing key (can be same as store password)

**This creates:** `dog-and-bone-release.keystore` (keep this file VERY safe!)

---

**Step 2: Store credentials securely**

Create `android/keystore.properties` (this file is in .gitignore - never commit it):

```properties
storeFile=../dog-and-bone-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=dog-and-bone
keyPassword=YOUR_KEY_PASSWORD
```

---

## Signing Methods

### Method 1: Automated Script (Recommended)

Use the provided `sign-release.sh` script:

```bash
cd android
./sign-release.sh
```

This will:
1. Check for unsigned release APK
2. Read credentials from `keystore.properties`
3. Sign the APK with `jarsigner`
4. Optimize with `zipalign`
5. Output: `dog-and-bone-launcher-release-signed.apk`

---

### Method 2: Manual Signing

**Step 1: Build unsigned release APK**
```bash
cd launcher
./gradlew assembleRelease
```

**Step 2: Sign with jarsigner**
```bash
jarsigner -verbose \
  -sigalg SHA256withRSA \
  -digestalg SHA-256 \
  -keystore dog-and-bone-release.keystore \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD \
  app/build/outputs/apk/release/app-release-unsigned.apk \
  dog-and-bone
```

**Step 3: Optimize with zipalign**
```bash
$ANDROID_HOME/build-tools/34.0.0/zipalign -v 4 \
  app/build/outputs/apk/release/app-release-unsigned.apk \
  app/build/outputs/apk/release/app-release-signed.apk
```

**Step 4: Verify signature**
```bash
jarsigner -verify -verbose -certs \
  app/build/outputs/apk/release/app-release-signed.apk
```

Should output: `jar verified.`

---

### Method 3: Gradle Auto-Signing

**Step 1: Update `app/build.gradle`**

Add this after `buildTypes`:

```gradle
signingConfigs {
    release {
        def keystorePropertiesFile = rootProject.file("../keystore.properties")
        def keystoreProperties = new Properties()
        if (keystorePropertiesFile.exists()) {
            keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
        }
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release  // Add this line
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```

**Step 2: Build (now auto-signs)**
```bash
./gradlew assembleRelease
```

Output: `app/build/outputs/apk/release/app-release.apk` (already signed!)

---

## Security Best Practices

### ✅ DO:
- Store the keystore in a secure location (encrypted backup, password manager)
- Use strong, unique passwords (20+ characters)
- Keep `keystore.properties` in `.gitignore` (already configured)
- Make encrypted backups of the keystore
- Store passwords in a password manager (1Password, LastPass, etc.)

### ❌ DON'T:
- Commit the keystore to Git
- Commit `keystore.properties` to Git
- Share the keystore or passwords
- Use weak passwords
- Lose the keystore (can't update app without it!)

---

## Backup Keystore

**Immediately after creating the keystore:**

```bash
# Encrypt and backup
gpg -c dog-and-bone-release.keystore

# This creates: dog-and-bone-release.keystore.gpg
# Store this encrypted file in multiple secure locations:
# - Password manager
# - Encrypted cloud storage
# - Encrypted USB drive
```

**To restore:**
```bash
gpg -d dog-and-bone-release.keystore.gpg > dog-and-bone-release.keystore
```

---

## Verification Commands

**Check APK signature:**
```bash
jarsigner -verify -verbose -certs app-release-signed.apk
```

**View certificate details:**
```bash
keytool -list -v -keystore dog-and-bone-release.keystore -alias dog-and-bone
```

**Check APK alignment:**
```bash
$ANDROID_HOME/build-tools/34.0.0/zipalign -c -v 4 app-release-signed.apk
```

---

## Distribution

Once signed:
1. Test the signed APK on a real device
2. Distribute via:
   - Email to customers (after order completion)
   - Download link from your website
   - Google Play Store (if publishing publicly)

**For Dog and Bone workflow:**
- Admin receives order → runs `generate-setup-script` function
- Downloads customer-specific ADB script
- Runs script to configure phone with signed launcher APK
- Ships configured phone

---

## Troubleshooting

**Error: "jarsigner: command not found"**
```bash
# macOS
export PATH=$PATH:/Library/Java/JavaVirtualMachines/*/Contents/Home/bin
```

**Error: "zipalign: command not found"**
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0
```

**Error: "Keystore was tampered with"**
- Wrong password
- Corrupted keystore file (restore from backup!)

---

## Summary Checklist

- [ ] Create keystore with strong passwords
- [ ] Create `keystore.properties` (not committed to Git)
- [ ] Make encrypted backups of keystore
- [ ] Store passwords in password manager
- [ ] Test signing with `sign-release.sh`
- [ ] Verify signed APK with `jarsigner -verify`
- [ ] Test signed APK on device
- [ ] Document keystore location in secure notes

**Need help?** See `android/sign-release.sh` for the automated signing script.
