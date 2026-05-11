# Dog and Bone - Device Tracking & Remote Configuration

AWS serverless infrastructure for device inventory and remote configuration management.

## Architecture Overview

```
┌─────────────────┐
│  Android Device │ ──HTTP→ API Gateway ──→ Lambda Functions
│  (Dog & Bone)   │                            ↓
└─────────────────┘                      DynamoDB (Devices)
                                               ↓
┌─────────────────┐                      S3 (Configs)
│  Local Admin    │ ──HTTP→ API Gateway ──→ Lambda Functions  
│  Dashboard      │         (List/Update)
└─────────────────┘
```

## AWS Services Used

| Service | Purpose | Cost |
|---------|---------|------|
| **DynamoDB** | Device inventory database | ~£1/month (low volume) |
| **S3** | Remote configuration storage | ~£0.50/month |
| **Lambda** | API functions (register, list, update) | ~£0.20/month |
| **API Gateway** | REST API endpoints | ~£1/month |
| **Total** | | **~£3/month** |

---

## Deployment

### Prerequisites

- AWS CLI configured: `aws configure`
- SAM CLI installed: `brew install aws-sam-cli`

### Deploy Infrastructure

```bash
cd infrastructure

# Build
sam build -t device-management.yaml

# Deploy to dev
sam deploy \
  --template-file .aws-sam/build/template.yaml \
  --stack-name dog-and-bone-device-mgmt-dev \
  --parameter-overrides Environment=dev \
  --capabilities CAPABILITY_IAM \
  --region eu-west-2

# Deploy to prod
sam deploy \
  --template-file .aws-sam/build/template.yaml \
  --stack-name dog-and-bone-device-mgmt-prod \
  --parameter-overrides Environment=prod \
  --capabilities CAPABILITY_IAM \
  --region eu-west-2
```

### Get API Details

```bash
aws cloudformation describe-stacks \
  --stack-name dog-and-bone-device-mgmt-dev \
  --query 'Stacks[0].Outputs' \
  --output table
```

You'll need:
- **DeviceApiUrl** - Add to launcher as `DEVICE_API_URL`
- **ApiKeyId** - Get actual key value with:

```bash
aws apigateway get-api-key \
  --api-key YOUR_KEY_ID \
  --include-value \
  --query 'value' \
  --output text
```

---

## API Endpoints

### 1. Register/Update Device (Called by Launcher)

**POST** `/device/register`

Headers:
- `Content-Type: application/json`
- `x-api-key: YOUR_API_KEY`

Body:
```json
{
  "deviceSerial": "RZ8R60DV17N",
  "orderId": "cs_test_abc123",
  "profileId": "family",
  "appList": ["phone", "sms", "camera"],
  "launcherVersion": "1.0.0"
}
```

Response:
```json
{
  "success": true,
  "deviceSerial": "RZ8R60DV17N"
}
```

---

### 2. Get Device Config (Called by Launcher)

**GET** `/device/config/{serial}`

Headers:
- `x-api-key: YOUR_API_KEY`

Response:
```json
{
  "profile": "family",
  "apps": ["com.samsung.android.dialer", ...],
  "pinEnabled": true,
  "largeText": false,
  "configVersion": 2
}
```

---

### 3. Update Device Config (Called by Admin)

**PUT** `/device/config/{serial}`

Headers:
- `Content-Type: application/json`
- `x-api-key: YOUR_API_KEY`

Body:
```json
{
  "profile": "family",
  "apps": [...],
  "pinEnabled": true
}
```

---

### 4. List All Devices (Admin Dashboard)

**GET** `/devices`

Headers:
- `x-api-key: YOUR_API_KEY`

Response:
```json
{
  "devices": [
    {
      "deviceSerial": "RZ8R60DV17N",
      "orderId": "cs_test_abc123",
      "profileId": "family",
      "firstSeen": "2026-05-03T12:00:00Z",
      "lastSeen": "2026-05-03T18:00:00Z",
      "configVersion": 1,
      "status": "active"
    }
  ]
}
```

---

## Launcher Integration

### Add to MainActivity.kt onCreate():

```kotlin
// Register device on boot (requires internet)
lifecycleScope.launch(Dispatchers.IO) {
    registerDevice()
}

// Check for config updates periodically
WorkManager.getInstance(this).enqueueUniquePeriodicWork(
    "config-sync",
    ExistingPeriodicWorkPolicy.KEEP,
    PeriodicWorkRequestBuilder<ConfigSyncWorker>(1, TimeUnit.HOURS).build()
)
```

### Create ConfigSyncWorker.kt:

```kotlin
class ConfigSyncWorker(context: Context, params: WorkerParameters) : Worker(context, params) {
    override fun doWork(): Result {
        val serial = Build.getSerial()
        val apiUrl = BuildConfig.DEVICE_API_URL
        val apiKey = BuildConfig.DEVICE_API_KEY

        // Fetch latest config
        val url = URL("$apiUrl/device/config/$serial")
        val connection = url.openConnection() as HttpURLConnection
        connection.setRequestProperty("x-api-key", apiKey)

        if (connection.responseCode == 200) {
            val newConfig = connection.inputStream.bufferedReader().readText()
            
            // Save to external storage (launcher will reload on next start)
            val file = File(
                context.getExternalFilesDir(null),
                "app-config.json"
            )
            file.writeText(newConfig)

            return Result.success()
        }

        return Result.retry()
    }
}
```

---

## Local Admin Integration

Update `admin-server/index.js` to add:

```javascript
// List all devices from AWS
app.get('/api/devices/inventory', async (req, res) => {
  const apiUrl = process.env.AWS_DEVICE_API_URL
  const apiKey = process.env.AWS_DEVICE_API_KEY

  const response = await fetch(`${apiUrl}/devices`, {
    headers: { 'x-api-key': apiKey }
  })

  const data = await response.json()
  res.json(data)
})

// Update device config
app.put('/api/devices/:serial/config', async (req, res) => {
  const { serial } = req.params
  const config = req.body

  const apiUrl = process.env.AWS_DEVICE_API_URL
  const apiKey = process.env.AWS_DEVICE_API_KEY

  const response = await fetch(`${apiUrl}/device/config/${serial}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    },
    body: JSON.stringify(config)
  })

  const data = await response.json()
  res.json(data)
})
```

---

## Environment Variables

Add to main project `.env`:

```
# AWS Device Management API
AWS_DEVICE_API_URL=https://abc123.execute-api.eu-west-2.amazonaws.com/dev
AWS_DEVICE_API_KEY=your-api-key-here
```

Add to `admin-server/.env`:

```
AWS_DEVICE_API_URL=https://abc123.execute-api.eu-west-2.amazonaws.com/dev
AWS_DEVICE_API_KEY=your-api-key-here
NETLIFY_URL=http://localhost:8888
ADMIN_SECRET=your_admin_secret_here
```

---

## Features Enabled

### ✅ Device Inventory
- Track all shipped devices
- See serial number, order ID, profile
- First seen / last seen timestamps
- Current config version

### ✅ Remote Configuration
- Push app list changes to devices
- Update profiles remotely
- Devices poll hourly for updates
- Changes apply on next launcher restart

### ✅ Device Monitoring
- See which devices are active (last seen < 24h)
- Identify offline devices
- Track configuration versions

---

## Security

- ✅ API Key authentication (devices and admin)
- ✅ Encrypted at rest (DynamoDB + S3)
- ✅ No public access to S3
- ✅ IAM least-privilege policies
- ✅ API keys rotatable via AWS Console

---

## Implementation Timeline

**Phase 1 (Today):** Deploy AWS infrastructure (30 min)
**Phase 2 (Tomorrow):** Add launcher integration (2-3 hours)
**Phase 3 (Week 1):** Update local admin UI (2-3 hours)

---

## Cost Estimate

| Metric | Volume | Cost |
|--------|--------|------|
| Devices | 100 active | £0 |
| API calls | 2,400/day (100 devices × 24 checks) | £0.20/month |
| DynamoDB | 100 items | £1/month |
| S3 storage | 100 configs (10KB each) | £0.50/month |
| **Total** | | **~£2-3/month** |

Scales automatically with device count.

---

## Next Steps

1. **Deploy AWS infrastructure:** `sam deploy`
2. **Get API URL and Key** from CloudFormation outputs
3. **Update launcher** with registration code
4. **Test device registration** with one device
5. **Add inventory view** to local admin
6. **Ship phones** with auto-registration!

This gives you complete visibility and control over all deployed devices! 🚀

---

## API Key Rotation Runbook

The `AWS_DEVICE_API_KEY` is embedded into the launcher APK at build time (per [ADR-011](../docs/DECISIONS.md#adr-011-api-key-auth-for-device-endpoints-not-cognito)). Rotation therefore requires a coordinated change across AWS, the admin server, the launcher build, and any already-provisioned devices.

### When to rotate

- **Immediately** if the key has leaked (committed to git, posted publicly, shared over email/chat)
- **Periodically** — every 6–12 months as baseline hygiene
- After off-boarding anyone with access to `local.properties` or the admin-server `.env`

### Rotation procedure

1. **Create the new key** in AWS Console
   - API Gateway → APIs → `dog-and-bone-device-api-<env>` → **API Keys** → Create
   - Copy the key value immediately — it's not shown again
   - Open the **Usage Plan** (`dog-and-bone-device-usage-<env>`) and associate the new key with it
2. **Smoke test** the new key before touching anything that depends on the old one
   ```bash
   curl -H "x-api-key: <NEW_KEY>" https://<api-id>.execute-api.eu-west-2.amazonaws.com/<env>/devices
   ```
   Expect HTTP 200 with a JSON body. If 403, the key is not yet bound to the Usage Plan.
3. **Update local developer environments**
   - Edit `android/launcher/local.properties` → replace `AWS_DEVICE_API_KEY`
   - Edit the operator's `.env` for `admin-server/` → replace `AWS_DEVICE_API_KEY`
4. **Update Netlify environment variables** (if any server-side code uses the key — currently none, but guard against drift)
   - Netlify dashboard → Site settings → Environment variables → `AWS_DEVICE_API_KEY`
5. **Rebuild + re-sign the launcher APK**
   ```bash
   cd android/launcher
   ./gradlew clean assembleRelease
   # then sign with the production keystore via scripts/sign-release.sh
   ```
   Confirm the new APK's `versionCode` is bumped so already-deployed devices treat it as an update.
6. **Redistribute the APK** to provisioned devices
   - For devices still on-hand: reflash via the admin-server's setup flow
   - For devices in the field: there is no OTA today — rotation requires either a courier return, a remote management tool, or accepting that older APKs will continue using the old key until the device is next touched
7. **Disable the old key in AWS**
   - Only after you've confirmed every updated client works with the new key
   - API Gateway → API Keys → old key → **Disable** (keep for 24h so you can re-enable if something breaks), then **Delete**
8. **Verify** — in AWS CloudWatch, check that there are no more `Forbidden` errors on the API and no requests using the old key's identifier

### If the old key was in git history

1. Confirm scope — is the repo private? Who has access?
2. Assume the key is compromised even if repo access is tight; rotate anyway (steps above)
3. Optional — scrub history with `git filter-repo`:
   ```bash
   # One-time install
   brew install git-filter-repo

   # From a fresh clone (filter-repo refuses to run in a dirty repo)
   git clone <remote> dog-and-bone-scrub && cd dog-and-bone-scrub
   echo 'ACmh8yUtjE6mxVuRKMOYG7PjrwoBSa336tIqTd8w==>***REDACTED***' > /tmp/replacements.txt
   git filter-repo --replace-text /tmp/replacements.txt
   git push --force-with-lease origin main
   ```
   This rewrites every commit that contained the literal. Force-push invalidates every collaborator's local clone — they must re-clone. Do not do this unless the value of scrubbing outweighs the disruption.

### What NOT to do

- Don't commit the new key — it lives only in `local.properties` (gitignored) and AWS
- Don't skip the smoke test in step 2 — binding a new key to the Usage Plan is easy to forget
- Don't delete the old key before confirming the new one works end-to-end
- Don't paste keys into Slack, email, or chat — use 1Password or similar
