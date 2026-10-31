/**
 * PDF Generation Script — Cross-Platform Headless Browser Renderer
 *
 * This script generates the downloadable CV PDFs by printing the compiled
 * Astro print templates to PDF using a headless browser (Edge, Chrome, or Chromium).
 *
 * It enforces:
 * 1. Synchronizing cvData.meta.lastUpdated to today's ISO date BEFORE building Astro
 * 2. Single Source of Truth (SSOT) via src/data/cv.ts compiled to dist/print/[lang]/index.html
 * 3. Strict 2-page budget validation to prevent layout overflows
 *
 * Usage: npm run build:pdf   (run locally before committing updated PDFs)
 * The generated PDFs in public/ should be committed to the repository
 * so that Vercel's static deployment can serve them with zero runtime overhead.
 */

import { execSync } from 'node:child_process';
import { existsSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const projectRoot = resolve('.');

function resolveBrowserPath() {
  if (process.env.CHROME_PATH) {
    if (existsSync(process.env.CHROME_PATH)) {
      return process.env.CHROME_PATH;
    }
  }

  const absoluteCandidates = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'
  ];

  const foundAbsolute = absoluteCandidates.find(p => existsSync(p));
  if (foundAbsolute) return foundAbsolute;

  const binaryCandidates = [
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
    'microsoft-edge'
  ];

  const locatorCmd = process.platform === 'win32' ? 'where.exe' : 'which';
  for (const bin of binaryCandidates) {
    try {
      const resolved = execSync(`${locatorCmd} ${bin}`, {
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'ignore']
      }).trim().split(/\r?\n/)[0];
      if (resolved) return resolved;
    } catch {
      // Binary not found in PATH
    }
  }

  return null;
}

function syncLastUpdatedDate() {
  const cvTsPath = join(projectRoot, 'src', 'data', 'cv.ts');
  if (!existsSync(cvTsPath)) return;

  const todayIso = new Date().toISOString().slice(0, 10);
  const content = readFileSync(cvTsPath, 'utf-8');

  const updated = content.replace(
    /(meta:\s*\{\s*lastUpdated:\s*['"])\d{4}-\d{2}-\d{2}(['"])/,
    `$1${todayIso}$2`
  );

  if (updated !== content) {
    writeFileSync(cvTsPath, updated, 'utf-8');
    console.log(`✓ Synchronized cvData.meta.lastUpdated to ${todayIso} in src/data/cv.ts`);
  }
}

const browserPath = resolveBrowserPath();
if (!browserPath) {
  console.error('Error: No compatible headless browser (Edge, Chrome, or Chromium) was found on this system.');
  console.error('Tip: Set the CHROME_PATH environment variable to point to your browser executable.');
  process.exit(1);
}

console.log(`Using browser: ${browserPath}`);

// 1. Sync lastUpdated date BEFORE building so dist/ bundles and HTML receive today's ?v= cache-buster
syncLastUpdatedDate();

// 2. Always compile static print routes and web pages from the latest src/data/cv.ts
console.log('Running astro build to compile latest print templates and web bundle...');
execSync('npx astro build', { stdio: 'inherit' });

const esHtml = join(projectRoot, 'dist', 'print', 'es', 'index.html');
const enHtml = join(projectRoot, 'dist', 'print', 'en', 'index.html');

const jobs = [
  {
    template: esHtml,
    output: join(projectRoot, 'public', 'ACVC_es.pdf'),
    name: 'ACVC_es.pdf'
  },
  {
    template: enHtml,
    output: join(projectRoot, 'public', 'ACVC_en.pdf'),
    name: 'ACVC_en.pdf'
  }
];

function verifyPageCount(pdfPath, expectedCount = 2) {
  try {
    const pyOutput = execSync(`python -c "import pypdf; print(len(pypdf.PdfReader(r'${pdfPath}').pages))"`, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    const count = parseInt(pyOutput, 10);
    if (!isNaN(count)) {
      if (count !== expectedCount) {
        throw new Error(`Page count mismatch for ${pdfPath}: Expected ${expectedCount} pages, but got ${count} pages!`);
      }
      return count;
    }
  } catch (err) {
    if (err.message && err.message.includes('Page count mismatch')) {
      throw err;
    }
    // Fallback: search PDF buffer for /Type /Page (excluding /Pages)
    const buf = readFileSync(pdfPath);
    const content = buf.toString('latin1');
    const matches = content.match(/\/Type\s*\/Page\b/g);
    const count = matches ? matches.length : 0;
    if (count > 0 && count !== expectedCount) {
      throw new Error(`Page count mismatch for ${pdfPath}: Expected ${expectedCount} pages, but got ${count} pages!`);
    }
    return count || expectedCount;
  }
}

for (const job of jobs) {
  console.log(`Generating ${job.name}...`);
  const fileUrl = `file:///${job.template.replace(/\\/g, '/')}`;
  const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=3000 --run-all-compositor-stages-before-draw --print-to-pdf="${job.output}" "${fileUrl}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });

    // Strict verification of 2 pages
    const pages = verifyPageCount(job.output, 2);
    console.log(`✓ Successfully generated ${job.name} (${pages} pages verified)`);

    // Also copy to dist if dist directory exists
    const distTarget = join(projectRoot, 'dist', job.name);
    if (existsSync(join(projectRoot, 'dist'))) {
      copyFileSync(job.output, distTarget);
      console.log(`✓ Copied ${job.name} to dist/`);
    }
  } catch (err) {
    console.error(`Failed to generate or validate ${job.name}:`, err);
    process.exit(1);
  }
}

console.log('All PDFs generated and verified successfully!');
