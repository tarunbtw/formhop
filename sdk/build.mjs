import { build } from 'esbuild'
import { gzipSync } from 'zlib'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const result = await build({
  entryPoints: [join(__dirname, 'src/index.ts')],
  bundle: true,
  minify: true,
  format: 'iife',
  globalName: 'FormhopSDK',
  target: ['es2017'],
  outfile: join(__dirname, 'dist/formhop.min.js'),
  platform: 'browser',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})

// Report gzipped size
const raw = readFileSync(join(__dirname, 'dist/formhop.min.js'))
const gzipped = gzipSync(raw)
const kb = (gzipped.length / 1024).toFixed(2)
console.log(`✓ Built dist/formhop.min.js — ${kb}KB gzipped`)

// Copy to frontend/public for Vercel CDN distribution
const frontendPublicDir = join(__dirname, '../frontend/public')
const frontendCdnDir = join(frontendPublicDir, 'cdn')
try {
  mkdirSync(frontendCdnDir, { recursive: true })
  writeFileSync(join(frontendPublicDir, 'formhop.min.js'), raw)
  writeFileSync(join(frontendCdnDir, 'formhop.min.js'), raw)
  writeFileSync(join(frontendCdnDir, 'formhop.js'), raw)
  console.log(`✓ Mirrored CDN bundles to frontend/public/cdn/`)
} catch (err) {
  console.warn('Could not mirror to frontend/public:', err)
}

if (gzipped.length > 5 * 1024) {
  console.warn(`⚠ Bundle exceeds 5KB gzipped target (${kb}KB)`)
}
