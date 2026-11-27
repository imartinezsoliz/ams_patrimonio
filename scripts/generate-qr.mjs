/**
 * Generates one QR plaque per site and registers it in Supabase.
 *
 *   node scripts/generate-qr.mjs --all
 *   node scripts/generate-qr.mjs --site casa-de-la-libertad --site musef
 *   node scripts/generate-qr.mjs --site musef --rotate     # revoke old plaque, issue a new one
 *   node scripts/generate-qr.mjs --site musef --dry-run    # no database access
 *
 * Each QR encodes  <QR_BASE_URL>/q/<token>  where token is 192 random bits.
 * Only sha256(token) is stored (qr_codes.token_hash); the plaintext exists
 * solely in the output files, so keep the output folder private. It is
 * git-ignored.
 *
 * Env (from .env or the shell):
 *   SUPABASE_URL                server-side project URL (falls back to VITE_SUPABASE_URL)
 *   SUPABASE_SERVICE_ROLE_KEY   NEVER expose this to the frontend
 *   QR_BASE_URL                 public domain of the PWA, e.g. https://larutablanca.app
 *                               (fixed once plaques are printed!)
 */
import { createHash, randomBytes } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import QRCode from 'qrcode'
import { createClient } from '@supabase/supabase-js'

try {
  process.loadEnvFile('.env')
} catch {
  // no .env file: rely on the real environment
}

const { values: args } = parseArgs({
  options: {
    all: { type: 'boolean', default: false },
    site: { type: 'string', multiple: true, default: [] },
    rotate: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
    out: { type: 'string', default: 'qr-output' }
  }
})

const fail = (msg) => {
  console.error(`Error: ${msg}`)
  process.exit(1)
}

const baseUrl = process.env.QR_BASE_URL?.replace(/\/+$/, '')
if (!baseUrl) fail('QR_BASE_URL is not set (e.g. https://larutablanca.app)')
if (!args.all && args.site.length === 0) fail('pass --all or at least one --site <id>')
if (args.all && args.site.length > 0) fail('use either --all or --site, not both')

const dryRun = args['dry-run']
let db = null
if (!dryRun) {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) fail('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (or use --dry-run)')
  db = createClient(url, key, { auth: { persistSession: false } })
}

// --- Resolve target sites ----------------------------------------------------
let sites
if (dryRun) {
  if (args.all) fail('--all needs the database; with --dry-run pass --site <id>')
  sites = args.site.map((id) => ({ id, name: id }))
} else {
  const query = db.from('sites').select('id, name').order('id')
  const { data, error } = args.all ? await query : await query.in('id', args.site)
  if (error) fail(error.message)
  const missing = args.site.filter((id) => !data.some((s) => s.id === id))
  if (missing.length) fail(`unknown site id(s): ${missing.join(', ')}`)
  sites = data
}

mkdirSync(args.out, { recursive: true })
// codes.csv accumulates across runs: rotating one site must not drop the others' links
// (tokens cannot be recovered from the database).
const csvPath = join(args.out, 'codes.csv')
const csvRows = new Map()
if (existsSync(csvPath)) {
  for (const line of readFileSync(csvPath, 'utf8').split('\n').slice(1)) {
    if (line.trim()) csvRows.set(line.slice(0, line.indexOf(',')), line)
  }
}
let created = 0

for (const site of sites) {
  if (!dryRun) {
    const { data: active, error } = await db
      .from('qr_codes')
      .select('id')
      .eq('site_id', site.id)
      .eq('active', true)
    if (error) fail(error.message)

    if (active.length > 0 && !args.rotate) {
      console.log(`skip    ${site.id} (already has an active QR; use --rotate to replace it)`)
      continue
    }
    if (active.length > 0) {
      const { error: revokeError } = await db
        .from('qr_codes')
        .update({ active: false, revoked_at: new Date().toISOString() })
        .eq('site_id', site.id)
        .eq('active', true)
      if (revokeError) fail(revokeError.message)
    }
  }

  const token = randomBytes(24).toString('base64url')
  const hash = createHash('sha256').update(token).digest('hex')

  if (!dryRun) {
    const { error } = await db
      .from('qr_codes')
      .insert({ site_id: site.id, token_hash: `\\x${hash}` })
    if (error) fail(`${site.id}: ${error.message}`)
  }

  const url = `${baseUrl}/q/${token}`
  const opts = { errorCorrectionLevel: 'H', margin: 4 }
  await QRCode.toFile(join(args.out, `${site.id}.png`), url, { ...opts, width: 1024 })
  writeFileSync(join(args.out, `${site.id}.svg`), await QRCode.toString(url, { ...opts, type: 'svg' }))
  csvRows.set(site.id, `${site.id},"${site.name.replace(/"/g, '""')}",${url}`)
  created++
  console.log(`created ${site.id}${dryRun ? ' (dry run, not registered)' : ''}`)
}

if (created > 0) {
  const lines = [...csvRows.keys()].sort().map((id) => csvRows.get(id))
  writeFileSync(csvPath, ['site_id,site_name,url', ...lines].join('\n') + '\n')
}
console.log(`\n${created} QR code(s) written to ${args.out}/ — keep this folder private.`)
