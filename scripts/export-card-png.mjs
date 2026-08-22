import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'business-card-s1-print.html');
const outPath = path.join(root, 'business-card-s1-print.png');

const WIDTH = 1050;
const HEIGHT = 600;

const browser = await puppeteer.launch({ headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
await page.evaluateHandle('document.fonts.ready');
await new Promise((r) => setTimeout(r, 500));

const card = await page.$('.card');
await card.screenshot({ path: outPath, type: 'png' });

await browser.close();
console.log(`Saved ${outPath} (${WIDTH}×${HEIGHT}px @ 300 dpi → 3.5″×2″)`);
