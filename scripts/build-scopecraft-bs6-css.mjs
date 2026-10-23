/**
 * Prefix Bootstrap 6 CSS so it only applies inside .sc-bs6-root (no VitePress bleed).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import prefixSelector from 'postcss-prefix-selector'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const src = path.join(root, 'node_modules/bootstrap/dist/css/bootstrap.min.css')
const out = path.join(root, '.vitepress/theme/scopecraft-bs6.bootstrap.css')

const css = fs.readFileSync(src, 'utf8')
const result = await postcss([
  prefixSelector({
    prefix: '.sc-bs6-root',
    exclude: [/^@/],
    transform(prefix, selector, prefixed) {
      if (selector.startsWith('@')) return selector
      // Bootstrap sets tokens on :root and :host. Keep them inside the catalog root
      // so they do not inherit onto the VitePress shell (.VPNav).
      if (selector === ':root' || selector === 'html') return prefix
      if (selector.startsWith(':root')) return selector.replace(':root', prefix)
      if (selector.startsWith('html')) return selector.replace(/^html/, prefix)
      return prefixed
    },
  }),
]).process(css, { from: src, to: out })

fs.writeFileSync(out, result.css)
console.log('Wrote', out, `(${Math.round(result.css.length / 1024)} KiB)`)
