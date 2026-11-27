/**
 * Uploads local photos to the public Supabase Storage bucket `site-images`
 * and points the matching rows at them.
 *
 *   images/sites/<site-id>.jpg     -> sites.image_url      (e.g. images/sites/musef.jpg)
 *   images/routes/<route-id>.webp  -> routes.image_url
 *   images/cards/<card-id>.png     -> cards.image_url      (optional; cards fall back to their site's image)
 *
 *   node scripts/upload-images.mjs                 # uploads everything in ./images
 *   node scripts/upload-images.mjs --dir photos    # other folder
 *   node scripts/upload-images.mjs --dry-run       # only list what would happen (no keys needed)
 *
 * The file name (without extension) must be an existing id. Accepted: .jpg .jpeg .png .webp,
 * max 2 MB each (bucket limit). Aim for ~1600 px on the long side and < 400 KB (WebP or JPG):
 * the app loads these over mobile data. The script does not resize or convert.
 *
 * Needs SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY (see .env.example).
 * Re-running replaces the file and keeps the same URL; scripts/generate-seed.mjs never
 * overwrites an image that points at this bucket.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import { parseArgs } from 'node:util'
import { createClient } from '@supabase/supabase-js'

try {
  process.loadEnvFile('.env')
} catch {
  // no .env file: rely on the real environment
}

const { values: args } = parseArgs({
  options: {
    dir: { type: 'string', default: 'images' },
    'dry-run': { type: 'boolean', default: false }
  }
})

const BUCKET = 'site-images'
const MAX_BYTES = 2 * 1024 * 1024
const WARN_BYTES = 400 * 1024
const TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }
const KINDS = [
  { folder: 'sites', table: 'sites' },
  { folder: 'routes', table: 'routes' },
  { folder: 'cards', table: 'cards' }
]

const fail = (msg) => {
  console.error(`Error: ${msg}`)
  process.exit(1)
}

if (!existsSync(args.dir)) fail(`folder "${args.dir}" not found (create ${args.dir}/sites, ${args.dir}/routes, ${args.dir}/cards)`)

const dryRun = args['dry-run']
let db = null
if (!dryRun) {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) fail('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required (or use --dry-run)')
  db = createClient(url, key, { auth: { persistSession: false } })
}

let uploaded = 0
let skipped = 0

for (const { folder, table } of KINDS) {
  const dir = join(args.dir, folder)
  if (!existsSync(dir)) continue

  for (const file of readdirSync(dir).sort()) {
    const ext = extname(file).toLowerCase()
    const id = basename(file, extname(file))
    const full = join(dir, file)

    if (!TYPES[ext]) {
      console.log(`skip    ${folder}/${file} (unsupported type; use jpg, png or webp)`)
      skipped++
      continue
    }
    const size = statSync(full).size
    if (size > MAX_BYTES) {
      console.log(`skip    ${folder}/${file} (${Math.round(size / 1024)} KB exceeds the 2 MB limit)`)
      skipped++
      continue
    }
    const note = size > WARN_BYTES ? `  [warning: ${Math.round(size / 1024)} KB is heavy for mobile]` : ''

    if (dryRun) {
      console.log(`would upload ${folder}/${file} -> ${table}.${id}${note}`)
      uploaded++
      continue
    }

    // Unique path per extension so replacing a .jpg with a .webp doesn't leave a stale file in use.
    const path = `${folder}/${id}${ext}`
    const { error: uploadError } = await db.storage
      .from(BUCKET)
      .upload(path, readFileSync(full), { contentType: TYPES[ext], upsert: true, cacheControl: '3600' })
    if (uploadError) {
      console.log(`FAILED  ${path}: ${uploadError.message}`)
      skipped++
      continue
    }

    const { data: pub } = db.storage.from(BUCKET).getPublicUrl(path)
    // ?v= busts CDN/browser caches when a photo is replaced under the same name
    const publicUrl = `${pub.publicUrl}?v=${Date.now()}`
    const { data: rows, error: updateError } = await db
      .from(table)
      .update({ image_url: publicUrl })
      .eq('id', id)
      .select('id')
    if (updateError) fail(`${table}.${id}: ${updateError.message}`)
    if (rows.length === 0) {
      console.log(`WARNING ${path} uploaded, but no ${table} row has id "${id}" (check the file name)`)
      skipped++
      continue
    }
    console.log(`ok      ${path}${note}`)
    uploaded++
  }
}

console.log(`\n${uploaded} ${dryRun ? 'would be uploaded' : 'uploaded'}, ${skipped} skipped.`)
