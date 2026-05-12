/**
 * Emits admin-server/public/app-catalogue.js from src/data/apps.ts.
 *
 * The admin dashboard is plain HTML/JS and has no build step. This keeps the
 * app catalogue in sync with the customer-facing site without duplicating it.
 *
 * Run via: npm run generate:admin-catalogue
 */
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { APPS } from '../src/data/apps.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const serialisable = APPS.map(
  ({ id, name, description, category, packageName, defaultInProfiles, available }) => ({
    id,
    name,
    description,
    category,
    packageName,
    defaultInProfiles,
    available,
  }),
)

const banner = `// Auto-generated from src/data/apps.ts via \`npm run generate:admin-catalogue\`.
// Do not edit by hand — edit src/data/apps.ts instead.
`

const body = `window.APP_CATALOGUE = ${JSON.stringify(serialisable, null, 2)};\n`

const outPath = resolve(__dirname, '..', 'admin-server', 'public', 'app-catalogue.js')
writeFileSync(outPath, banner + body)

console.log(`Wrote ${serialisable.length} apps to ${outPath}`)
