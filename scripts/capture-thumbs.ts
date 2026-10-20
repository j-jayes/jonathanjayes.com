/**
 * Screenshot each catalogue entry's live page into apps/catalogue/static/thumbs/<slug>.webp.
 * Run locally (not in CI): pnpm thumbs [--force] [--only slug,slug]
 * Needs Playwright's Chromium once: pnpm exec playwright install chromium
 */
import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from 'js-yaml';
import { chromium } from 'playwright';
import sharp from 'sharp';

type Entry = { slug: string; live: string; hidden?: boolean };
const root = resolve(import.meta.dirname, '..');
const outDir = resolve(root, 'apps/catalogue/static/thumbs');
mkdirSync(outDir, { recursive: true });

const argv = process.argv.slice(2);
const force = argv.includes('--force');
const onlyIdx = argv.indexOf('--only');
const only = onlyIdx >= 0 ? new Set(argv[onlyIdx + 1]?.split(',')) : null;

const items = (load(readFileSync(resolve(root, 'data/catalogue.yaml'), 'utf8')) as Entry[]).filter(
  (i) => !i.hidden && (!only || only.has(i.slug))
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
for (const item of items) {
  const out = resolve(outDir, `${item.slug}.webp`);
  if (existsSync(out) && !force) continue;
  try {
    // Some pages poll or stream forever, so fall back to the load event.
    await page.goto(item.live, { waitUntil: 'networkidle', timeout: 20_000 }).catch(() =>
      page.goto(item.live, { waitUntil: 'load', timeout: 45_000 })
    );
    await page.waitForTimeout(1500); // let Reveal.js and fonts settle
    const png = await page.screenshot({ type: 'png' });
    await sharp(png).resize(800, 500).webp({ quality: 72 }).toFile(out);
    console.log(`ok   ${item.slug}`);
  } catch (e) {
    console.warn(`fail ${item.slug}: ${(e as Error).message.split('\n')[0]}`);
  }
}
await browser.close();
