import type { Handler, HandlerEvent } from '@netlify/functions'
import { stripe } from './utils/stripe-client'
import { CORS_HEADERS } from './utils/cors'

// Samsung A12 bloatware to always disable
const ALL_PACKAGES: string[] = [
  'com.sec.android.app.launcher', // CRITICAL: Disable Samsung launcher so Dog and Bone is the only option
  'com.samsung.android.app.tips',
  'com.samsung.android.game.gamehome',
  'com.samsung.android.game.gos',
  'com.samsung.android.bixby.agent',
  'com.samsung.android.bixby.wakeup',
  'com.samsung.android.bixby.service',
  'com.samsung.android.voiceserviceplatform',
  'com.samsung.android.app.cocktailbarservice',
  'com.samsung.android.app.smartcapture',
  'com.samsung.android.app.galaxyfinder',
  'com.samsung.android.game.gametools',
  'com.samsung.android.game.gametools.watchdog',
  'com.samsung.android.provider.filterprovider',
  'com.samsung.android.scloud',
  'com.samsung.android.app.spage',
  'com.samsung.android.app.watchmanagersam',
  'com.samsung.systemui.bixby2',
  'com.samsung.android.visionintelligence',
  'com.sec.android.easyonehand',
  'com.google.android.youtube',
  'com.google.android.apps.tachyon',
  'com.google.android.music',
  'com.google.android.videos',
  'com.google.android.apps.googleassistant',
  'com.android.chrome',
]

// App ID → package name mapping with installation metadata
const APP_TO_PACKAGES: Record<string, string> = {
  phone: 'com.samsung.android.dialer',
  sms: 'com.samsung.android.messaging',
  whatsapp: 'com.whatsapp',
  'facetime-video': 'com.google.android.apps.meetings',
  email: 'com.google.android.gm',
  gmaps: 'com.google.android.apps.maps',
  camera: 'com.sec.android.app.camera',
  gallery: 'com.sec.android.gallery3d',
  steps: 'com.samsung.android.shealth',
  calculator: 'com.sec.android.app.popupcalculator',
  alarm: 'com.sec.android.app.clockpackage',
  clock: 'com.sec.android.app.clockpackage',
  calendar: 'com.google.android.calendar',
  notes: 'com.samsung.android.app.notes',
  weather: 'com.samsung.android.weather',
  browser: 'com.sec.android.app.sbrowser',
  settings: 'com.android.settings',
}

// Apps that are NOT pre-installed and need APK files
const REQUIRES_APK_INSTALL: Record<string, string> = {
  'com.whatsapp': 'whatsapp.apk',
  'com.google.android.apps.meetings': 'google-meet.apk',
  'org.thoughtcrime.securesms': 'signal.apk',
  'org.telegram.messenger': 'telegram.apk',
}

const ALL_AVAILABLE_APP_IDS = Object.keys(APP_TO_PACKAGES)

interface Contact {
  name: string
  phone: string
}

function generateContactImportStep(
  seniorContacts: Contact[],
  familyEmergencyContact: Contact | null,
  profileId: string,
): string {
  const allContacts: Contact[] = []

  if (profileId === 'senior' && seniorContacts.length > 0) {
    allContacts.push(...seniorContacts)
  }

  if (profileId === 'family' && familyEmergencyContact) {
    allContacts.push(familyEmergencyContact)
  }

  if (allContacts.length === 0) {
    return '# No contacts to import'
  }

  const vcfFiles = allContacts
    .map((contact, idx) => {
      const safePhone = contact.phone.replace(/[^0-9+]/g, '')
      return `
cat > /tmp/contact-${idx}.vcf << 'VCF_EOF'
BEGIN:VCARD
VERSION:3.0
FN:${contact.name}
TEL;TYPE=CELL:${safePhone}
END:VCARD
VCF_EOF
adb push /tmp/contact-${idx}.vcf /sdcard/contact-${idx}.vcf
adb shell am start -a android.intent.action.VIEW -d "file:///sdcard/contact-${idx}.vcf" -t "text/x-vcard" 2>/dev/null || true
sleep 0.5`
    })
    .join('\n')

  return `
# --- Import Contacts ---
echo ""
echo "Step 5.5/10: Importing ${allContacts.length} contact(s)..."
${vcfFiles}
echo "✅ Contact(s) imported"
`
}

function generateScript(
  orderId: string,
  profileId: string,
  selectedAppIds: string[],
  seniorContacts: Contact[],
  familyEmergencyContact: Contact | null,
): string {
  const generatedAt = new Date().toISOString()
  const appsLabel = selectedAppIds.join(', ')

  // Deduplicate selected packages (alarm and clock share a package)
  const selectedPackages = [
    ...new Set(selectedAppIds.map((id) => APP_TO_PACKAGES[id]).filter(Boolean)),
  ]

  // Note: Settings app is NOT included by default for maximum minimalism
  // Customers can request it via custom apps if needed

  // Non-selected app packages (excluding already-selected)
  const nonSelectedPackages = [
    ...new Set(
      ALL_AVAILABLE_APP_IDS.filter((id) => !selectedAppIds.includes(id))
        .map((id) => APP_TO_PACKAGES[id])
        .filter((pkg) => !selectedPackages.includes(pkg)),
    ),
  ]

  const bloatwareLines = ALL_PACKAGES.map(
    (pkg) => `adb shell pm disable-user --user 0 ${pkg} 2>/dev/null || true`,
  ).join('\n')

  const disableLines = nonSelectedPackages
    .map((pkg) => `adb shell pm disable-user --user 0 ${pkg} 2>/dev/null || true`)
    .join('\n')

  const enableLines = selectedPackages
    .map((pkg) => `adb shell pm enable --user 0 ${pkg} 2>/dev/null || true`)
    .join('\n')

  // Identify packages that need APK installation
  const packagesNeedingInstall = selectedPackages.filter((pkg) => REQUIRES_APK_INSTALL[pkg])

  const installLines = packagesNeedingInstall
    .map((pkg) => {
      const apkFile = REQUIRES_APK_INSTALL[pkg]
      return `
# Check if ${pkg} is installed
if ! adb shell pm list packages | grep -q "^package:${pkg}$"; then
  echo "  📦 ${pkg} not installed - attempting install from APK library..."
  if [ -f "apks/${apkFile}" ]; then
    adb install apks/${apkFile}
    echo "  ✅ ${pkg} installed from apks/${apkFile}"
  else
    echo "  ⚠️  apks/${apkFile} not found. Download from official source and place in apks/ directory"
    echo "     The app will not appear in the launcher until installed."
  fi
else
  echo "  ✅ ${pkg} already installed"
fi`
    })
    .join('\n')

  // Generate app-config.json for launcher
  const appConfig = {
    profile: profileId,
    apps: selectedPackages,
    showEmergencyButton: profileId === 'senior',
    pinEnabled: profileId === 'family',
    emergencyNumber: profileId === 'senior' ? '999' : '',
    largeText: profileId === 'senior',
  }

  const appConfigJson = JSON.stringify(appConfig, null, 2)

  return `#!/bin/bash
# ============================================================
# Dog and Bone — Order Setup Script
# Order: ${orderId}
# Profile: ${profileId}
# Apps: ${appsLabel}
# Generated: ${generatedAt}
# ============================================================

set -e

echo "🦴 Dog and Bone Setup Script"
echo "Order: ${orderId}"
echo "Profile: ${profileId}"
echo ""

# Check ADB connection
if ! adb devices | grep -q "device$"; then
  echo "❌ No device found. Connect your phone and enable USB debugging."
  exit 1
fi

echo "📱 Device connected. Starting setup..."

# --- Step 1: Disable Samsung/Google bloatware ---
echo ""
echo "Step 1/10: Removing bloatware..."
${bloatwareLines}

# --- Step 2: Disable non-selected apps ---
echo ""
echo "Step 2/10: Disabling non-selected apps..."
${disableLines || '# No additional apps to disable'}

# --- Step 3: Install missing apps from APK library ---
echo ""
echo "Step 3/8: Installing missing apps (if needed)..."
${installLines || '# No apps require installation - all pre-installed on device'}

# --- Step 4: Enable selected apps ---
echo ""
echo "Step 4/8: Enabling selected apps..."
${enableLines}

# --- Step 5: Push launcher configuration ---
echo ""
echo "Step 5/10: Creating launcher configuration..."

# Create temp config file
cat > /tmp/dog-and-bone-config.json << 'CONFIG_EOF'
${appConfigJson}
CONFIG_EOF

# Push config to device (both locations for compatibility)
adb push /tmp/dog-and-bone-config.json /sdcard/Android/data/com.dogandbonephone.launcher/files/app-config.json
echo "✅ Configuration pushed to external storage"

# Also push to app-specific directory (preferred, no permissions needed)
adb shell mkdir -p /sdcard/Android/data/com.dogandbonephone.launcher/files
adb push /tmp/dog-and-bone-config.json /sdcard/Android/data/com.dogandbonephone.launcher/files/app-config.json

# --- Step 5: Install Dog and Bone Launcher ---
echo ""
echo "Step 6/10: Installing launcher APK..."
echo "⚠️  Place the signed launcher APK in the same directory as this script"
echo "    and name it: dog-and-bone-launcher.apk"

if [ -f "dog-and-bone-launcher.apk" ]; then
  adb install -r dog-and-bone-launcher.apk
  echo "✅ Launcher installed"
else
  echo "⚠️  dog-and-bone-launcher.apk not found - install manually"
fi

${generateContactImportStep(seniorContacts, familyEmergencyContact, profileId)}

# --- Step 6: Set as Device Owner (CRITICAL for complete lockdown) ---
echo ""
echo "Step 7/10: Setting Device Owner mode (complete lockdown)..."
echo ""
echo "⚠️  DEVICE MUST HAVE NO ACCOUNTS (Google, Samsung, Microsoft)"
echo "    If this fails, factory reset and skip all accounts during setup"
echo ""

adb shell dpm set-device-owner com.dogandbonephone.launcher/.AdminReceiver

if [ $? -eq 0 ]; then
  echo "✅ Device Owner enabled - launcher is now in full kiosk mode"
  echo "   Home button is now completely blocked"
else
  echo "❌ Device Owner setup failed!"
  echo "   The device has accounts configured. To fix:"
  echo "   1. Factory reset the device"
  echo "   2. Skip ALL accounts during setup (Google, Samsung, Microsoft)"
  echo "   3. Re-run this script"
  echo ""
  echo "⚠️  Without Device Owner, users can exit the launcher!"
fi

# --- Step 7: Set as default launcher ---
echo ""
echo "Step 8/10: Setting as default home launcher..."
echo ""
echo "On the phone, complete these steps:"
echo "  1. Go to: Settings → Apps → Default apps → Home app"
echo "  2. Select: Dog and Bone"
echo "  3. Tap: Always"
echo ""

# --- Step 8: Final verification ---
echo ""
echo "Step 9/10: Launching Dog and Bone..."
adb shell am start -n com.dogandbonephone.launcher/.MainActivity

echo ""
echo "============================================"
echo "✅ Setup complete for order ${orderId}!"
echo "============================================"
echo ""
echo "Profile: ${profileId}"
echo "Apps configured: ${appsLabel}"
${profileId === 'senior' ? 'echo "Large text mode: ENABLED"\necho "Emergency SOS: ENABLED (999)"' : ''}
${profileId === 'family' ? 'echo "PIN lock: ENABLED (user will set PIN on first launch)"' : ''}
echo "Device Owner: ENABLED (full kiosk lockdown)"
echo ""

# --- Step 10: Final verification ---
echo ""
echo "Step 10/10: Verifying installation..."
echo ""

# Check which requested apps are actually available
echo "Checking app availability:"
${selectedPackages
  .map((pkg) => {
    const appName = Object.keys(APP_TO_PACKAGES).find((k) => APP_TO_PACKAGES[k] === pkg) || pkg
    return `
if adb shell pm list packages | grep -q "^package:${pkg}$"; then
  if adb shell pm list packages -d | grep -q "^package:${pkg}$"; then
    echo "  ⚠️  ${appName} (${pkg}) - DISABLED (enable it manually)"
  else
    echo "  ✅ ${appName} (${pkg}) - Available"
  fi
else
  echo "  ❌ ${appName} (${pkg}) - NOT INSTALLED"
fi`
  })
  .join('')}

echo ""
echo "🧪 Test the device:"
echo "  - Press Home button → Should do NOTHING"
echo "  - Press Back button in launcher → Should do NOTHING"
echo "  - Open an app → Cannot exit to other launchers"
echo "  - Reboot device → Dog and Bone auto-starts"
echo "  - Notification shade → BLOCKED"
echo ""
echo "📦 Ready to ship!"
echo ""
`
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  const params = event.queryStringParameters ?? {}
  const { secret, orderId } = params

  if (!secret || secret !== process.env.ADMIN_SECRET) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Unauthorized' }),
    }
  }

  if (!orderId) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'orderId query parameter is required' }),
    }
  }

  let session: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>

  try {
    session = await stripe.checkout.sessions.retrieve(orderId)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve session'
    console.error('Stripe session retrieve error:', err)
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: message }),
    }
  }

  const profileId = session.metadata?.profileId ?? 'unknown'
  const appsRaw = session.metadata?.apps ?? ''
  const selectedAppIds = appsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  // Extract contacts from metadata
  const seniorContactsRaw = session.metadata?.seniorContacts || '[]'
  const familyEmergencyContactRaw = session.metadata?.familyEmergencyContact || 'null'

  let seniorContacts: { name: string; phone: string }[] = []
  let familyEmergencyContact: { name: string; phone: string } | null = null

  try {
    seniorContacts = JSON.parse(seniorContactsRaw)
  } catch {
    // Invalid JSON, ignore
  }

  try {
    familyEmergencyContact = JSON.parse(familyEmergencyContactRaw)
  } catch {
    // Invalid JSON, ignore
  }

  const scriptContent = generateScript(
    orderId,
    profileId,
    selectedAppIds,
    seniorContacts,
    familyEmergencyContact,
  )

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/x-sh',
      'Content-Disposition': `attachment; filename="order-${orderId}-setup.sh"`,
    },
    body: scriptContent,
  }
}
