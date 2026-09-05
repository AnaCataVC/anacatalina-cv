import { execSync } from 'node:child_process';
import { existsSync, copyFileSync } from 'node:fs';
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
  process.exit(1);
}

console.log(`Using browser: ${browserPath}`);

const jobs = [
  {
    template: join(projectRoot, 'templates', 'cv-template-es.html'),
    output: join(projectRoot, 'public', 'ACVC_es.pdf'),
    name: 'ACVC_es.pdf'
  },
  {
    template: join(projectRoot, 'templates', 'cv-template-en.html'),
    output: join(projectRoot, 'public', 'ACVC_en.pdf'),
    name: 'ACVC_en.pdf'
  }
];

for (const job of jobs) {
  console.log(`Generating ${job.name}...`);
  const fileUrl = `file:///${job.template.replace(/\\/g, '/')}`;
  const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --virtual-time-budget=3000 --run-all-compositor-stages-before-draw --print-to-pdf="${job.output}" "${fileUrl}"`;
  
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✓ Successfully generated ${job.name}`);
    
    // Also copy to dist if dist directory exists
    const distTarget = join(projectRoot, 'dist', job.name);
    if (existsSync(join(projectRoot, 'dist'))) {
      copyFileSync(job.output, distTarget);
      console.log(`✓ Copied ${job.name} to dist/`);
    }
  } catch (err) {
    console.error(`Failed to generate ${job.name}:`, err);
    process.exit(1);
  }
}

console.log('All PDFs generated successfully!');
