#!/usr/bin/env node
/**
 * Build the web image variants for a guitar (or any folder of photos).
 *
 *   node scripts/build-images.mjs guitar12
 *   node scripts/build-images.mjs guitar12 --force
 *   node scripts/build-images.mjs images/process --short display=760
 *
 * Reads the source photos sitting directly in the folder (.jpg/.jpeg/.heic)
 * and writes:
 *
 *   display/   main gallery + card image, 960px short edge, plus .webp
 *   large/     lightbox image, 1500px short edge
 *   thumbs/    gallery thumbnail, 240px short edge
 *   thumbs2x/  same at 480px, for HiDPI displays
 *
 * Sizes are capped on the SHORT edge, so a landscape and a portrait photo end
 * up at comparable weight. Sizing by the long edge (sips -Z) silently produces
 * much heavier landscape files, which is what made the first guitar12 gallery
 * slow; sizing by height alone has the same problem in reverse.
 *
 * HEIC sources are converted to a .jpeg original alongside them first, since
 * browsers cannot be relied on to render HEIC.
 *
 * Requires sips (macOS) and cwebp (brew install webp).
 */

import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

// "short" caps the shorter edge of the photo; jpegQuality/webp are encoder
// quality settings. webp: null means that variant is JPEG-only.
const VARIANTS = {
  display: { short: 960, jpegQuality: 74, webp: 78 },
  large: { short: 1500, jpegQuality: 80, webp: null },
  thumbs: { short: 240, jpegQuality: 78, webp: null },
  thumbs2x: { short: 480, jpegQuality: 76, webp: null },
};

const SOURCE_EXTS = ['.jpg', '.jpeg', '.heic'];

function parseArgs(argv) {
  const args = { target: null, force: false, shorts: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force' || a === '-f') args.force = true;
    else if (a === '--short') {
      for (const pair of (argv[++i] || '').split(',')) {
        const [k, v] = pair.split('=');
        if (k && v) args.shorts[k.trim()] = Number(v);
      }
    } else if (!a.startsWith('-')) args.target = a;
  }
  return args;
}

function run(cmd, cmdArgs) {
  try {
    execFileSync(cmd, cmdArgs, { stdio: ['ignore', 'ignore', 'pipe'] });
    return true;
  } catch (err) {
    const detail = err.stderr ? String(err.stderr).trim() : err.message;
    throw new Error(`${cmd} failed: ${detail}`);
  }
}

function have(cmd) {
  try {
    execFileSync('which', [cmd], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function dimensions(file) {
  const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], {
    encoding: 'utf8',
  });
  const w = out.match(/pixelWidth:\s*(\d+)/);
  const h = out.match(/pixelHeight:\s*(\d+)/);
  return { width: w ? +w[1] : 0, height: h ? +h[1] : 0 };
}

const kb = (file) => Math.round(fs.statSync(file).size / 1024);

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.target) {
    console.error('usage: node scripts/build-images.mjs <guitar12|images/process> [--force] [--short display=760]');
    process.exit(1);
  }
  for (const tool of ['sips', 'cwebp']) {
    if (!have(tool)) {
      console.error(`error: "${tool}" not found. cwebp comes from: brew install webp`);
      process.exit(1);
    }
  }

  // Accept either a bare guitar name or a path relative to the repo root.
  const dir = args.target.includes('/')
    ? path.resolve(root, args.target)
    : path.join(root, 'images', args.target);

  if (!fs.existsSync(dir)) {
    console.error(`error: no such folder: ${path.relative(root, dir)}`);
    process.exit(1);
  }

  for (const [name, v] of Object.entries(args.shorts)) {
    if (!VARIANTS[name]) {
      console.error(`error: unknown variant "${name}" (expected: ${Object.keys(VARIANTS).join(', ')})`);
      process.exit(1);
    }
    VARIANTS[name].short = v;
  }

  // HEIC first: browsers need a JPEG original next to it.
  for (const f of fs.readdirSync(dir)) {
    if (path.extname(f).toLowerCase() !== '.heic') continue;
    const src = path.join(dir, f);
    const out = path.join(dir, path.basename(f, path.extname(f)) + '.jpeg');
    if (fs.existsSync(out) && !args.force) continue;
    run('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '92', src, '--out', out]);
    console.log(`converted  ${f} -> ${path.basename(out)} (${kb(out)} KB)`);
  }

  const sources = fs
    .readdirSync(dir)
    .filter((f) => SOURCE_EXTS.includes(path.extname(f).toLowerCase()))
    .filter((f) => path.extname(f).toLowerCase() !== '.heic')
    .sort();

  if (!sources.length) {
    console.error(`error: no source photos in ${path.relative(root, dir)}`);
    process.exit(1);
  }

  for (const name of Object.keys(VARIANTS)) {
    fs.mkdirSync(path.join(dir, name), { recursive: true });
  }

  let built = 0;
  let skipped = 0;
  const warnings = [];

  for (const file of sources) {
    const src = path.join(dir, file);
    const base = path.basename(file, path.extname(file));
    const { width, height } = dimensions(src);
    const orientation = width >= height ? 'landscape' : 'portrait';
    console.log(`\n${file}  ${width}x${height} ${orientation}  ${kb(src)} KB`);

    for (const [variant, cfg] of Object.entries(VARIANTS)) {
      const outJpg = path.join(dir, variant, `${base}.jpg`);

      if (fs.existsSync(outJpg) && !args.force) {
        skipped++;
        continue;
      }

      // Cap the short edge, so orientation does not change the file weight.
      const shortEdge = Math.min(width, height);

      // Never upscale: a source smaller than the target would only get heavier.
      if (shortEdge < cfg.short) {
        warnings.push(`${file}: ${variant} skipped — short edge is only ${shortEdge}px (target ${cfg.short}px)`);
        continue;
      }

      const flag = orientation === 'landscape' ? '--resampleHeight' : '--resampleWidth';
      run('sips', [
        flag, String(cfg.short),
        '-s', 'format', 'jpeg',
        '-s', 'formatOptions', String(cfg.jpegQuality),
        src, '--out', outJpg,
      ]);

      let line = `  ${variant.padEnd(9)} ${String(kb(outJpg)).padStart(4)} KB jpg`;

      if (cfg.webp) {
        const outWebp = path.join(dir, variant, `${base}.webp`);
        run('cwebp', ['-q', String(cfg.webp), '-quiet', outJpg, '-o', outWebp]);
        line += ` / ${String(kb(outWebp)).padStart(4)} KB webp`;
      }

      console.log(line);
      built++;
    }
  }

  console.log(`\nbuilt ${built} file(s)${skipped ? `, skipped ${skipped} existing (use --force to rebuild)` : ''}`);

  for (const w of warnings) console.log(`warning: ${w}`);

  console.log(
    '\nReminder: reference display/*.webp from a <picture> element, e.g.\n' +
      '  <picture>\n' +
      `    <source srcset="images/<name>/display/FILE.webp" type="image/webp">\n` +
      `    <img src="images/<name>/display/FILE.jpg" alt="..." decoding="async">\n` +
      '  </picture>\n' +
      'Images high on the page should NOT carry loading="lazy".'
  );
}

main();
