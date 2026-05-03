# Dog and Bone - Local Admin Server

A local Node.js server for device configuration and order management.

## What It Does

- 🔌 Detects connected Android devices via ADB
- 📦 Fetches Stripe orders in real-time
- 🤖 Generates setup scripts automatically
- ▶️  Runs setup scripts on connected devices
- 📊 Monitors configuration progress

## Requirements

- Node.js 20+
- ADB (Android Debug Bridge) in PATH
- Netlify site running (or localhost:8888)
- Admin secret from main project .env

## Setup

```bash
cd admin-server
npm install
```

## Usage

### Start the Admin Server

```bash
npm start
```

Access at: **http://localhost:3000**

### Development Mode (Auto-restart)

```bash
npm run dev
```

## Workflow

### Per Customer Order:

1. **Device Preparation:**
   - Factory reset Samsung A12
   - Skip all accounts during setup
   - Enable USB debugging
   - Connect via USB to your laptop

2. **In Admin Dashboard:**
   - Open http://localhost:3000
   - Status bar shows "Device connected: [serial]"
   - Recent orders list appears (from Stripe)
   - Click **"Run Setup"** on the order

3. **Automated Setup:**
   - Script generates for that specific order
   - Disables bloatware
   - Installs WhatsApp (if selected)
   - Installs launcher APK
   - Imports contacts
   - Configures WiFi
   - Sets Device Owner mode
   - Shows progress and output

4. **Complete:**
   - Device fully configured
   - Set as default launcher (manual step)
   - Ready to ship!

## API Endpoints

```
GET  /api/health              - Health check
GET  /api/devices             - List connected ADB devices
GET  /api/orders              - Fetch Stripe orders
POST /api/generate-script/:id - Generate setup script for order
POST /api/run-setup/:id       - Execute setup on connected device
```

## Environment Variables

Set in main project `.env`:

```
ADMIN_SECRET=your-admin-secret
NETLIFY_URL=https://your-site.netlify.app
```

Or for local testing:
```
NETLIFY_URL=http://localhost:8888
```

## Troubleshooting

**"ADB not available"**
- Install Android Platform Tools: `brew install android-platform-tools`
- Verify: `adb --version`

**"No device connected"**
- Enable USB debugging on phone
- Connect via USB
- Approve USB debugging prompt
- Run: `adb devices`

**"Failed to fetch orders"**
- Check NETLIFY_URL is set correctly
- Verify admin secret matches
- Check network connection

**"Setup script failed"**
- Device must be factory reset
- No accounts added during setup
- USB debugging must be enabled
- Check script output for specific errors

## File Structure

```
admin-server/
├── index.js           → Express server with ADB integration
├── package.json       → Dependencies
├── public/
│   └── index.html     → Admin dashboard UI
└── README.md          → This file
```

## Security Notes

- Admin server runs LOCALLY only (localhost:3000)
- Not accessible from internet
- Requires admin secret for API access
- WiFi passwords deleted after device setup
- Customer data only in Stripe metadata

## Production Deployment

This server is for INTERNAL use only (your laptop/workstation).

Do NOT deploy to Netlify/Heroku - it needs local ADB access.

Run on the machine where you configure devices.
