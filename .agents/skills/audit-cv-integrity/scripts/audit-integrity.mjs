#!/usr/bin/env node

/**
 * audit-integrity.mjs
 *
 * Comprehensive static integrity auditor for the anacatalina-cv repository.
 * Enforces:
 * 1. Single Source of Truth (SSOT) parity in src/data/cv.ts (BilingualText { es, en } fields).
 * 2. i18n DOM binding integrity: verifies all data-i18n, data-i18n-href, data-i18n-aria
 *    attributes in Astro components exist in src/i18n.js, and warns on orphaned keys.
 * 3. Zero Flags Rule: ensures zero regional flag emojis in templates, documentation, and data.
 * 4. Identity & Privacy invariants: candidate name format, canonical email, and zero leaked local machine paths.
 * 5. Downloadable PDF 2-page print layout requirements (including buffer page-count verification).
 * 6. Cross-Repo Ecosystem Check (optional check for local ../anacatalina-mcp upstream sync utility).
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../../../../');
const args = process.argv.slice(2);

let errorCount = 0;
let warningCount = 0;

function reportPass(message) {
  console.log(`  \x1b[32m✓\x1b[0m ${message}`);
}

function reportFail(message) {
  console.error(`  \x1b[31m✗\x1b[0m ${message}`);
  errorCount++;
}

function reportWarn(message) {
  console.warn(`  \x1b[33m!\x1b[0m ${message}`);
  warningCount++;
}

// Helper getFiles closure
function getFiles(dir, filterRegex) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of list) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name === 'node_modules' || item.name === '.git' || item.name === 'dist') continue;
      results.push(...getFiles(fullPath, filterRegex));
    } else if (filterRegex.test(item.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

console.log('\n======================================================');
console.log('       CV INTEGRITY & QUALITY GATE AUDITOR');
console.log('======================================================\n');

// -----------------------------------------------------------------------------
// 1. Audit Single Source of Truth (src/data/cv.ts)
// -----------------------------------------------------------------------------
console.log('1. Auditing Single Source of Truth (src/data/cv.ts)...');

let cvData;
try {
  const cvUrl = pathToFileURL(path.join(projectRoot, 'src/data/cv.ts')).href;
  const cvModule = await import(cvUrl);
  cvData = cvModule.cvData;
  reportPass('src/data/cv.ts loaded and parsed successfully.');
} catch (err) {
  reportFail(`Failed to load src/data/cv.ts: ${err.message}`);
}

if (cvData) {
  let checkedBilingualCount = 0;

  function checkBilingualObject(obj, currentPath = '') {
    if (!obj || typeof obj !== 'object') return;

    // Check if this object is a BilingualText candidate
    if ('es' in obj && 'en' in obj && Object.keys(obj).length === 2) {
      checkedBilingualCount++;
      if (typeof obj.es !== 'string' || obj.es.trim() === '') {
        reportFail(`Empty or invalid 'es' translation at: ${currentPath}`);
      }
      if (typeof obj.en !== 'string' || obj.en.trim() === '') {
        reportFail(`Empty or invalid 'en' translation at: ${currentPath}`);
      }
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => checkBilingualObject(item, `${currentPath}[${index}]`));
    } else {
      for (const [key, value] of Object.entries(obj)) {
        checkBilingualObject(value, currentPath ? `${currentPath}.${key}` : key);
      }
    }
  }

  checkBilingualObject(cvData, 'cvData');
  reportPass(`Verified ${checkedBilingualCount} bilingual text nodes for full ES/EN parity.`);

  // Verify Experience items structure
  const experience = cvData.experience || [];
  experience.forEach((exp, idx) => {
    if (!exp.id || !exp.company || !exp.role) {
      reportFail(`Experience item [${idx}] is missing id, company, or role.`);
    }
    if (!Array.isArray(exp.bullets) || exp.bullets.length === 0) {
      reportFail(`Experience item '${exp.id || idx}' has no web bullets.`);
    }
    if (!Array.isArray(exp.pdfBullets) || exp.pdfBullets.length === 0) {
      reportWarn(`Experience item '${exp.id || idx}' has no pdfBullets (fallback to bullets might exceed 2-page print limit).`);
    }
  });

  // Verify Skills categories structure
  const skillCategories = cvData.skillCategories || [];
  skillCategories.forEach((cat, idx) => {
    if (!cat.id || !cat.title || !cat.pdfFormatted) {
      reportFail(`Skill category [${idx}] missing id, title, or pdfFormatted string.`);
    }
    if (!Array.isArray(cat.skills) || !cat.skills.length) {
      reportFail(`Skill category '${cat.id || idx}' has no listed skills.`);
    }
  });
}

// -----------------------------------------------------------------------------
// 2. Audit i18n Dictionaries & DOM Bindings
// -----------------------------------------------------------------------------
console.log('\n2. Auditing i18n Dictionaries & DOM Bindings...');

let translations;
try {
  const i18nRaw = fs.readFileSync(path.join(projectRoot, 'src/i18n.js'), 'utf-8');
  const cvFileUrl = pathToFileURL(path.join(projectRoot, 'src/data/cv.ts')).href;
  const transformed = i18nRaw.replace(/from\s+['"]\.\/data\/cv['"]/g, `from '${cvFileUrl}'`);
  const dataUri = `data:text/javascript;base64,${Buffer.from(transformed).toString('base64')}`;
  const i18nModule = await import(dataUri);
  translations = i18nModule.translations;
  reportPass('src/i18n.js loaded and resolved successfully.');
} catch (err) {
  reportFail(`Failed to load src/i18n.js: ${err.message}`);
}

if (translations) {
  let dictionaryKeyCount = 0;
  for (const [key, val] of Object.entries(translations)) {
    dictionaryKeyCount++;
    if (!val || typeof val !== 'object') {
      reportFail(`Translation key '${key}' does not resolve to an object.`);
      continue;
    }
    if (typeof val.es !== 'string' || val.es.trim() === '') {
      reportFail(`Translation key '${key}' has empty 'es' text.`);
    }
    if (typeof val.en !== 'string' || val.en.trim() === '') {
      reportFail(`Translation key '${key}' has empty 'en' text.`);
    }
  }
  reportPass(`Verified ${dictionaryKeyCount} translation keys in dictionary.`);

  const astroFiles = getFiles(path.join(projectRoot, 'src'), /\.(astro|html|js|ts)$/);
  const referencedKeys = new Set();
  const attrRegexes = [
    /data-i18n="([^"]+)"/g,
    /data-i18n-href="([^"]+)"/g,
    /data-i18n-aria="([^"]+)"/g
  ];

  const i18nFilePath = path.join(projectRoot, 'src/i18n.js');
  let combinedSrcContent = '';

  for (const filePath of astroFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (path.resolve(filePath) !== path.resolve(i18nFilePath)) {
      combinedSrcContent += content + '\n';
    }
    for (const regex of attrRegexes) {
      const matches = content.matchAll(regex);
      for (const m of matches) {
        referencedKeys.add(m[1]);
      }
    }
  }

  let missingDomKeys = 0;
  for (const key of referencedKeys) {
    if (!translations[key]) {
      reportFail(`DOM references missing translation key '${key}' in src/i18n.js`);
      missingDomKeys++;
    }
  }

  if (missingDomKeys === 0) {
    reportPass(`All ${referencedKeys.size} DOM bindings (data-i18n, href, aria) map directly to active keys in src/i18n.js.`);
  }

  // Check for unused/orphaned keys in src/i18n.js
  // Allow dynamically constructed keys in index.astro or main.js
  const dynamicAllowedKeys = new Set([
    'skills.status.all',
    'skills.status.filtered',
    'meta.title',
    'meta.description',
    'aria.closeMenu'
  ]);
  const dynamicExpKeyRegex = /^(exp\.[a-zA-Z0-9_-]+\.(title|date|location|b[1-4]|siteTitle)|aria\.(company|edu)\.[a-zA-Z0-9_-]+)$/;

  const orphanedKeys = [];
  for (const key of Object.keys(translations)) {
    const isReferencedInDom = referencedKeys.has(key);
    const isDynamicAllowed = dynamicAllowedKeys.has(key) || dynamicExpKeyRegex.test(key);
    const isReferencedInSrcCode = combinedSrcContent.includes(key);
    if (!isReferencedInDom && !isDynamicAllowed && !isReferencedInSrcCode) {
      orphanedKeys.push(key);
    }
  }

  if (orphanedKeys.length > 0) {
    for (const orphan of orphanedKeys) {
      reportWarn(`Orphaned i18n key '${orphan}' in src/i18n.js is never referenced in src/`);
    }
  } else {
    reportPass('Zero orphaned translation keys detected in src/i18n.js.');
  }
}

// -----------------------------------------------------------------------------
// 3. Audit Zero Flags Rule (No Regional Flag Emojis)
// -----------------------------------------------------------------------------
console.log('\n3. Auditing Zero Flags Rule (Zero country flags across all files)...');

// Regional Indicator Symbols: U+1F1E6 to U+1F1FF
const flagRegex = /[\uD83C][\uDDE6-\uDDFF]{2}/g;
const filesToScanForFlags = [
  ...getFiles(path.join(projectRoot, 'src'), /\.(astro|html|js|ts|css)$/),
  ...getFiles(path.join(projectRoot, 'docs'), /\.md$/),
  ...getFiles(path.join(projectRoot, '.agents'), /\.(md|mjs|js)$/),
  path.join(projectRoot, 'README.md'),
  path.join(projectRoot, 'README.es.md'),
  path.join(projectRoot, 'AGENTS.md')
].filter(f => fs.existsSync(f));

let flagViolations = 0;
for (const file of filesToScanForFlags) {
  const content = fs.readFileSync(file, 'utf-8');
  if (flagRegex.test(content)) {
    const rel = path.relative(projectRoot, file);
    reportFail(`Regional flag emoji detected in: ${rel}`);
    flagViolations++;
  }
}

if (flagViolations === 0) {
  reportPass(`Zero Flags Rule verified across ${filesToScanForFlags.length} project files.`);
}

// -----------------------------------------------------------------------------
// 4. Audit Candidate Identity & Privacy Invariants
// -----------------------------------------------------------------------------
console.log('\n4. Auditing Candidate Identity & Privacy Invariants...');

if (cvData && cvData.basics) {
  const name = cvData.basics.contact?.name || cvData.basics.name || '';
  if (!name.includes('Ana-Catalina')) {
    reportFail(`Candidate first name must strictly be hyphenated 'Ana-Catalina' (found: '${name}').`);
  } else {
    reportPass(`Candidate name invariant verified: '${name}'.`);
  }

  const email = cvData.basics.contact?.email || '';
  if (email !== 'anacatalina@outlook.cl') {
    reportFail(`Candidate contact email must be 'anacatalina@outlook.cl' (found: '${email}').`);
  } else {
    reportPass(`Candidate email invariant verified: '${email}'.`);
  }
}

// Scan for hardcoded machine paths
const machinePathRegex = /(?:[A-Za-z]:\\Users\\[A-Za-z0-9_-]+|\/Users\/[A-Za-z0-9_-]+|\/home\/[A-Za-z0-9_-]+)/g;
const publicDocsFiles = [
  path.join(projectRoot, 'README.md'),
  path.join(projectRoot, 'README.es.md'),
  ...getFiles(path.join(projectRoot, 'src'), /\.(astro|html|js|ts)$/)
].filter(f => fs.existsSync(f));

let pathViolations = 0;
for (const file of publicDocsFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(machinePathRegex);
  if (matches) {
    const rel = path.relative(projectRoot, file);
    reportFail(`Local machine path leak detected in ${rel}: ${matches[0]}`);
    pathViolations++;
  }
}

if (pathViolations === 0) {
  reportPass(`No local machine paths leaked in public documents or source code.`);
}

// -----------------------------------------------------------------------------
// 5. Audit Print PDF Artifacts & Templates
// -----------------------------------------------------------------------------
console.log('\n5. Auditing Print PDF Artifacts & Templates...');

const esPdfPath = path.join(projectRoot, 'public/ACVC_es.pdf');
const enPdfPath = path.join(projectRoot, 'public/ACVC_en.pdf');

function countPdfPagesFromBuffer(pdfPath) {
  const buf = fs.readFileSync(pdfPath);
  const content = buf.toString('latin1');
  const matches = content.match(/\/Type\s*\/Page\b/g);
  return matches ? matches.length : 0;
}

if (fs.existsSync(esPdfPath) && fs.existsSync(enPdfPath)) {
  const esStat = fs.statSync(esPdfPath);
  const enStat = fs.statSync(enPdfPath);
  reportPass(`Downloadable PDFs exist in public/ (ACVC_es.pdf: ${(esStat.size / 1024).toFixed(1)} KB, ACVC_en.pdf: ${(enStat.size / 1024).toFixed(1)} KB).`);

  for (const [label, pdfFile] of [['ACVC_es.pdf', esPdfPath], ['ACVC_en.pdf', enPdfPath]]) {
    const pageCount = countPdfPagesFromBuffer(pdfFile);
    if (pageCount === 2) {
      reportPass(`${label} strictly respects the 2-page budget (${pageCount} pages verified via PDF buffer).`);
    } else {
      reportFail(`${label} page count violation: expected strictly 2 pages, found ${pageCount} page(s).`);
    }
  }
} else {
  reportFail('Missing downloadable PDF artifacts in public/ (run `npm run build:pdf`).');
}

// Verify metadata date and cache-busting query parameter
const lastUpdated = cvData?.meta?.lastUpdated;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
if (!lastUpdated || !isoDateRegex.test(lastUpdated)) {
  reportFail(`cvData.meta.lastUpdated is missing or invalid ISO date in src/data/cv.ts (found: '${lastUpdated}').`);
} else {
  reportPass(`cvData.meta.lastUpdated verified as valid ISO date: '${lastUpdated}'.`);
}

// Check that i18n dictionary binds the version parameter
const esUrl = translations && translations['hero.cvUrl'] ? translations['hero.cvUrl'].es : '';
const enUrl = translations && translations['hero.cvUrl'] ? translations['hero.cvUrl'].en : '';
if (!esUrl.includes(`?v=${lastUpdated}`) || !enUrl.includes(`?v=${lastUpdated}`)) {
  reportFail(`hero.cvUrl in src/i18n.js must bind '?v=${lastUpdated}' (found: es='${esUrl}', en='${enUrl}').`);
} else {
  reportPass(`hero.cvUrl bilingual cache-busting parameters verified ('?v=${lastUpdated}').`);
}

const esPrintTemplate = path.join(projectRoot, 'src/pages/print/[lang].astro');
if (fs.existsSync(esPrintTemplate)) {
  reportPass(`Print template verified: src/pages/print/[lang].astro`);
} else {
  reportFail('Missing print template in src/pages/print/[lang].astro');
}

// -----------------------------------------------------------------------------
// 6. Optional Cross-Repo Ecosystem Check (anacatalina-mcp)
// -----------------------------------------------------------------------------
console.log('\n6. Checking Cross-Repo Ecosystem Synchronization (Optional)...');

const mcpSyncScript = path.resolve(projectRoot, '../anacatalina-mcp/scripts/sync_mcp_data.py');
if (fs.existsSync(mcpSyncScript)) {
  if (args.includes('--check-mcp')) {
    try {
      execSync(`python "${mcpSyncScript}" --audit`, { stdio: 'inherit' });
      reportPass('Downstream anacatalina-mcp synchronization audit passed.');
    } catch {
      reportWarn('Downstream anacatalina-mcp drift detected. Run `python ../anacatalina-mcp/scripts/sync_mcp_data.py --sync` in anacatalina-mcp.');
    }
  } else {
    reportPass('Sibling repository ../anacatalina-mcp detected. Run `python ../anacatalina-mcp/scripts/sync_mcp_data.py --audit` (or pass `--check-mcp`) to verify downstream MCP alignment.');
  }
} else {
  reportPass('Sibling repository ../anacatalina-mcp not present in parent directory (skipped in isolated/CI environment).');
}

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n======================================================');
if (errorCount === 0) {
  console.log(`\x1b[32mAUDIT PASSED:\x1b[0m 0 errors, ${warningCount} warnings.`);
  console.log('All integrity invariants, SSOT data, and i18n bindings are intact.');
  console.log('======================================================\n');
  process.exit(0);
} else {
  console.error(`\x1b[31mAUDIT FAILED:\x1b[0m ${errorCount} error(s), ${warningCount} warning(s) detected.`);
  console.error('Please resolve the reported errors before publishing or committing.');
  console.log('======================================================\n');
  process.exit(1);
}
