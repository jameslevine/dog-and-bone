/**
 * Generate launcher screenshot mockups
 * Run with: node scripts/generate-launcher-screenshots.js
 */

import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

const profiles = ['essential', 'family', 'senior', 'balance']

async function generateScreenshots() {
  console.log('🐕 Generating launcher screenshots...\n')

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  })
  const page = await browser.newPage()

  // Set viewport to phone size
  await page.setViewport({ width: 1600, height: 900 })

  // Navigate to mockup HTML
  const mockupPath = `file://${join(projectRoot, 'public', 'launcher-screenshots.html')}`
  console.log(`Opening: ${mockupPath}`)
  await page.goto(mockupPath, { waitUntil: 'networkidle0' })

  // Wait for render
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Get all phone elements
  const phones = await page.$$('.phone')
  console.log(`Found ${phones.length} phone mockups\n`)

  for (let i = 0; i < phones.length && i < profiles.length; i++) {
    const profile = profiles[i]
    const phone = phones[i]

    const outputPath = join(
      projectRoot,
      'public',
      'images',
      'screenshots',
      `launcher-${profile}.png`,
    )

    // Take screenshot of this phone element
    await phone.screenshot({
      path: outputPath,
      type: 'png',
    })

    console.log(`✅ ${profile}: ${outputPath}`)
  }

  await browser.close()

  console.log('\n🎉 All screenshots generated!')
  console.log('Check: public/images/screenshots/')
}

generateScreenshots().catch(console.error)
