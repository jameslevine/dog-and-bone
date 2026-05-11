/**
 * Dog and Bone - Local Admin Server
 *
 * Run this on your laptop to:
 * - Detect connected Android devices via ADB
 * - Fetch Stripe orders
 * - Generate and run setup scripts automatically
 * - Monitor device configuration progress
 *
 * Usage: node admin-server/index.js
 * Access: http://localhost:3000
 */

import express from 'express'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Check for connected ADB devices
app.get('/api/devices', async (req, res) => {
  try {
    const { stdout } = await execAsync('adb devices')
    const lines = stdout.split('\n').slice(1) // Skip header
    const devices = lines
      .filter((line) => line.trim() && !line.includes('List of devices'))
      .map((line) => {
        const [serial, state] = line.trim().split(/\s+/)
        return { serial, state, connected: state === 'device' }
      })

    res.json({ devices })
  } catch (error) {
    res.status(500).json({ error: 'ADB not available or not in PATH', details: error.message })
  }
})

// Fetch Stripe orders
app.get('/api/orders', async (req, res) => {
  try {
    const adminSecret = process.env.ADMIN_SECRET
    if (!adminSecret) {
      return res.status(500).json({ error: 'ADMIN_SECRET env var must be set' })
    }
    const netlifyUrl = process.env.NETLIFY_URL || 'http://localhost:8888'

    const response = await fetch(
      `${netlifyUrl}/.netlify/functions/list-orders?secret=${adminSecret}&limit=50`,
    )

    if (!response.ok) {
      throw new Error('Failed to fetch orders from Stripe')
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders', details: error.message })
  }
})

// Generate setup script for an order
app.post('/api/generate-script/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const adminSecret = process.env.ADMIN_SECRET
    if (!adminSecret) {
      return res.status(500).json({ error: 'ADMIN_SECRET env var must be set' })
    }
    const netlifyUrl = process.env.NETLIFY_URL || 'http://localhost:8888'

    const response = await fetch(
      `${netlifyUrl}/.netlify/functions/generate-setup-script?orderId=${orderId}&secret=${adminSecret}`,
    )

    if (!response.ok) {
      throw new Error('Failed to generate script')
    }

    const scriptContent = await response.text()

    // Save to temp directory
    const scriptPath = `/tmp/order-${orderId}-setup.sh`
    await fs.writeFile(scriptPath, scriptContent, { mode: 0o755 })

    res.json({ scriptPath, orderId })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate script', details: error.message })
  }
})

// Execute setup script on connected device
app.post('/api/run-setup/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params
    const scriptPath = `/tmp/order-${orderId}-setup.sh`

    // Check if device is connected
    const { stdout: devicesOutput } = await execAsync('adb devices')
    const hasDevice = devicesOutput.includes('device') && !devicesOutput.includes('unauthorized')

    if (!hasDevice) {
      return res
        .status(400)
        .json({ error: 'No device connected. Enable USB debugging and connect device.' })
    }

    // Copy launcher APK to script directory
    const launcherApk = path.join(
      __dirname,
      '../android/build-output/dog-and-bone-launcher-release-signed.apk',
    )
    await execAsync(`cp "${launcherApk}" /tmp/dog-and-bone-launcher.apk`)

    // Copy WhatsApp APK
    const whatsappApk = path.join(__dirname, '../android/apks/whatsapp.apk')
    if (
      await fs
        .access(whatsappApk)
        .then(() => true)
        .catch(() => false)
    ) {
      await execAsync(`mkdir -p /tmp/apks && cp "${whatsappApk}" /tmp/apks/`)
    }

    // Execute setup script
    const { stdout, stderr } = await execAsync(`cd /tmp && bash "${scriptPath}"`)

    res.json({
      success: true,
      orderId,
      output: stdout,
      errors: stderr || null,
    })
  } catch (error) {
    console.error('Setup script error:', error)
    res.status(500).json({
      error: 'Setup script failed',
      details: error.message,
      stderr: error.stderr || null,
      stdout: error.stdout || null,
    })
  }
})

// List all devices from AWS
app.get('/api/devices/inventory', async (req, res) => {
  try {
    const awsApiUrl = process.env.AWS_DEVICE_API_URL
    const awsApiKey = process.env.AWS_DEVICE_API_KEY
    if (!awsApiUrl || !awsApiKey) {
      return res
        .status(500)
        .json({ error: 'AWS_DEVICE_API_URL and AWS_DEVICE_API_KEY must be set' })
    }

    const response = await fetch(`${awsApiUrl}/devices`, {
      headers: { 'x-api-key': awsApiKey },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch device inventory from AWS')
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch device inventory', details: error.message })
  }
})

// Update device config remotely
app.put('/api/devices/:serial/config', async (req, res) => {
  try {
    const { serial } = req.params
    const config = req.body

    const awsApiUrl = process.env.AWS_DEVICE_API_URL
    const awsApiKey = process.env.AWS_DEVICE_API_KEY
    if (!awsApiUrl || !awsApiKey) {
      return res
        .status(500)
        .json({ error: 'AWS_DEVICE_API_URL and AWS_DEVICE_API_KEY must be set' })
    }

    const response = await fetch(`${awsApiUrl}/device/config/${serial}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': awsApiKey,
      },
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      throw new Error('Failed to update device config')
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update config', details: error.message })
  }
})

// Serve admin UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`
🐕 Dog and Bone - Admin Server
================================
🌐 Dashboard: http://localhost:${PORT}
🔧 API:       http://localhost:${PORT}/api

Capabilities:
- Detect connected ADB devices
- Fetch Stripe orders
- Generate setup scripts
- Run setup scripts on connected devices

Make sure ADB is in your PATH!
`)
})
