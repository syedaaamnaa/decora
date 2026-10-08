/**
 * Verifies every `react-icons/*` named import in src/ actually exists in the
 * package's exports. Run: node scripts/check-icons.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('src')
const files = []
;(function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const p = path.join(dir, entry)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) walk(p)
    else if (/\.(jsx?|tsx?)$/.test(entry)) files.push(p)
  }
})(root)

const re = /import\s*\{([^}]+)\}\s*from\s*['"](react-icons\/[^'"]+)['"]/g
const specs = []
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8')
  let match
  while ((match = re.exec(text))) {
    specs.push({
      file: path.relative(process.cwd(), file),
      names: match[1]
        .split(',')
        .map((s) => s.trim().split(/\s+as\s+/)[0])
        .filter(Boolean),
      pkg: match[2].trim(),
    })
  }
}

const mods = new Map()
for (const spec of specs) {
  if (!mods.has(spec.pkg)) {
    mods.set(spec.pkg, await import(spec.pkg))
  }
}

const missing = []
for (const spec of specs) {
  const mod = mods.get(spec.pkg)
  for (const name of spec.names) {
    if (!(name in mod)) missing.push(`${spec.file} -> ${name} (${spec.pkg})`)
  }
}

if (missing.length) {
  console.error(`MISSING ICON EXPORTS (${missing.length}):`)
  for (const line of missing) console.error('  ' + line)
  process.exit(1)
}
console.log(`ALL ICON IMPORTS OK (${specs.length} import statements checked)`)
