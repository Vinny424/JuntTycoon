// Build dist/index.html from src/ + assets/ (Node 18+). Same output as build.ps1.
// Usage: node build.mjs
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const tpl = readFileSync(join(root, 'index.template.html'), 'utf8');
const js = readdirSync(join(root, 'src')).filter(f => f.endsWith('.js')).sort()
  .map(f => readFileSync(join(root, 'src', f), 'utf8')).join('');
let out = tpl.split('@@SRC@@').join(js);
out = out.replace(/@@asset:([a-z0-9]+\/[a-z0-9+.-]+)@([^@]+)@@/g, (m, mime, rel) => {
  const p = join(root, rel);
  if (!existsSync(p)) throw new Error('Missing asset: ' + rel);
  return `data:${mime};base64,${readFileSync(p).toString('base64')}`;
});
mkdirSync(join(root, 'dist'), { recursive: true });
writeFileSync(join(root, 'dist', 'index.html'), out);
console.log(`Built dist/index.html (${(out.length / 1048576).toFixed(2)} MB)`);
