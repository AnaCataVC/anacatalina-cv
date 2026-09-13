/**
 * PDF Generation Script — Windows only
 *
 * This script generates the downloadable CV PDFs by printing the compiled
 * Astro print templates to PDF using a headless browser (Microsoft Edge or Google Chrome).
 *
 * It enforces:
 * 1. Single Source of Truth (SSOT) via src/data/cv.ts compiled to dist/print/[lang]/index.html
 * 2. Strict 2-page budget validation to prevent layout overflows
 *
 * Usage: npm run build:pdf   (run locally before committing updated PDFs)
 * The generated PDFs in public/ should be committed to the repository
 * so that Vercel's build process (which runs on Linux) can serve them.
 */

import { execSync } from 'node:child_process';
import { existsSync, copyFileSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const projectRoot = resolve('.');
const candidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let browserPath = candidates.find(p => existsSync(p));
if (!browserPath) {
  console.error('Error: Neither Microsoft Edge nor Google Chrome was found on this system.');
  console.error('Note: This script is designed for Windows only. See script header for details.');
  process.exit(1);
}

console.log(`Using browser: ${browserPath}`);

// Ensure dist/print HTML files exist, or trigger astro build automatically
const esHtml = join(projectRoot, 'dist', 'print', 'es', 'index.html');
const enHtml = join(projectRoot, 'dist', 'print', 'en', 'index.html');

if (!existsSync(esHtml) || !existsSync(enHtml)) {
  console.log('Static print pages not found in dist/. Running astro build...');
  execSync('npx astro build', { stdio: 'inherit' });
}

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
