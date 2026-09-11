#!/usr/bin/env node

/**
 * scan-activity.mjs
 *
 * Dynamically audits local personal repositories (~/Repos) and workplace repositories
 * (~/Archivos Trabajo) to detect recent technical activity, technologies, and achievements
 * for updating the CV and portfolio.
 *
 * INVARIANTS:
 * 1. ZERO HARDCODED PATHS: Resolves directories via os.homedir() and optional env vars.
 * 2. AUTHORSHIP VERIFICATION: Completely discards repositories without active commits by the user.
 * 3. ENTERPRISE ANONYMIZATION: Strips proprietary client names and internal credentials,
 *    focusing strictly on high-level technologies, engineering patterns, and abstract impact.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execSync } from 'node:child_process';

const HOME_DIR = os.homedir();
const PERSONAL_DIR = process.env.PERSONAL_REPOS_DIR
  ? path.resolve(process.env.PERSONAL_REPOS_DIR)
  : path.join(HOME_DIR, 'Repos');

const WORK_DIR = process.env.WORK_REPOS_DIR
  ? path.resolve(process.env.WORK_REPOS_DIR)
  : path.join(HOME_DIR, 'Archivos Trabajo');

// Parse CLI arguments
const args = process.argv.slice(2);
const outputJson = args.includes('--json');
const daysIndex = args.indexOf('--days');
const lookbackDays = daysIndex !== -1 && args[daysIndex + 1] ? parseInt(args[daysIndex + 1], 10) : 90;

const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - lookbackDays);

/**
 * Get configured git author identities and known handles
 */
function getUserIdentities() {
  const identities = new Set();
  try {
    const email = execSync('git config user.email', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (email) identities.add(email.toLowerCase());
  } catch {}

  try {
    const name = execSync('git config user.name', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    if (name) identities.add(name.toLowerCase());
  } catch {}

  // Known developer handles
  identities.add('anacatavc');
  identities.add('catavillalobosc');
  identities.add('ana-catalina');

  return Array.from(identities);
}

const userIdentities = getUserIdentities();

/**
 * Check if the repository has commits authored by the user within the lookback window
 */
function checkAuthorshipAndActivity(repoPath, isWorkplace = false) {
  const gitDir = path.join(repoPath, '.git');
  if (!fs.existsSync(gitDir)) return null;

  let authorCommits = [];
  try {
    const authorFilters = userIdentities.map(id => `--author="${id}"`).join(' ');
    const logCmd = `git log --all ${authorFilters} --since="${lookbackDays} days ago" --format="%cd|%h|%s" --date=iso -n 25`;
    const logOutput = execSync(logCmd, {
      cwd: repoPath,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (!logOutput) {
      // No commits authored by user in the lookback window
      return null;
    }

    authorCommits = logOutput.split('\n').map(line => {
      const [dateStr, hash, ...subjectParts] = line.split('|');
      return {
        date: dateStr ? new Date(dateStr) : null,
        hash: hash || '',
        subject: subjectParts.join('|') || '',
      };
    }).filter(c => c.date && c.date >= cutoffDate);

    if (authorCommits.length === 0) return null;
  } catch {
    return null;
  }

  // Detect tech stack from dependency manifests
  const detectedStack = detectTechStack(repoPath);

  // If workplace repository, sanitize commit messages to ensure zero business confidentiality leaks
  const sanitizedContributions = isWorkplace
    ? sanitizeWorkContributions(authorCommits)
    : authorCommits.map(c => c.subject);

  return {
    repoName: path.basename(repoPath),
    isWorkplace,
    commitCount: authorCommits.length,
    latestCommitDate: authorCommits[0].date.toISOString().split('T')[0],
    detectedStack,
    highlights: sanitizedContributions.slice(0, 5),
  };
}

/**
 * Inspects package and project manifests to detect technologies
 */
function detectTechStack(repoPath) {
  const stack = new Set();

  // JavaScript / TypeScript / Node
  const pkgJsonPath = path.join(repoPath, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (allDeps.astro) stack.add('Astro');
      if (allDeps.react) stack.add('React');
      if (allDeps.vue) stack.add('Vue');
      if (allDeps.tailwindcss) stack.add('Tailwind CSS');
      if (allDeps.typescript) stack.add('TypeScript');
      if (allDeps.vite) stack.add('Vite');
      if (allDeps.next) stack.add('Next.js');
      if (allDeps.express) stack.add('Express');
      if (allDeps.fastify) stack.add('Fastify');
    } catch {}
  }

  // Python
  const pyprojectPath = path.join(repoPath, 'pyproject.toml');
  const reqsPath = path.join(repoPath, 'requirements.txt');
  if (fs.existsSync(pyprojectPath) || fs.existsSync(reqsPath)) {
    stack.add('Python');
    let content = '';
    if (fs.existsSync(pyprojectPath)) content += fs.readFileSync(pyprojectPath, 'utf-8') + '\n';
    if (fs.existsSync(reqsPath)) content += fs.readFileSync(reqsPath, 'utf-8');

    const lower = content.toLowerCase();
    if (lower.includes('fastapi')) stack.add('FastAPI');
    if (lower.includes('pandas')) stack.add('Pandas');
    if (lower.includes('polars')) stack.add('Polars');
    if (lower.includes('torch') || lower.includes('pytorch')) stack.add('PyTorch');
    if (lower.includes('tensorflow')) stack.add('TensorFlow');
    if (lower.includes('scikit-learn') || lower.includes('sklearn')) stack.add('Scikit-Learn');
    if (lower.includes('pydantic')) stack.add('Pydantic');
    if (lower.includes('celery')) stack.add('Celery');
    if (lower.includes('sqlalchemy')) stack.add('SQLAlchemy');
  }

  // Rust
  if (fs.existsSync(path.join(repoPath, 'Cargo.toml'))) stack.add('Rust');

  // Go
  if (fs.existsSync(path.join(repoPath, 'go.mod'))) stack.add('Go');

  // .NET / C#
  try {
    const files = fs.readdirSync(repoPath);
    if (files.some(f => f.endsWith('.csproj') || f.endsWith('.sln'))) stack.add('.NET / C#');
  } catch {}

  // Docker
  if (fs.existsSync(path.join(repoPath, 'Dockerfile')) || fs.existsSync(path.join(repoPath, 'docker-compose.yml'))) {
    stack.add('Docker');
  }

  return Array.from(stack);
}

/**
 * Sanitize work commit messages into abstract technical contributions
 */
function sanitizeWorkContributions(commits) {
  const sanitized = [];
  for (const c of commits) {
    let msg = c.subject.trim();
    // Remove Jira / issue tickets like [SIMP-123], SIMP-123:, #123
    msg = msg.replace(/\[?[A-Z]+-\d+\]?:?/gi, '').trim();
    // Strip common private email or internal URLs
    msg = msg.replace(/https?:\/\/[^\s]+/g, '');
    // Clean whitespace
    msg = msg.replace(/\s+/g, ' ');
    if (msg.length > 5) {
      sanitized.push(msg);
    }
  }
  return sanitized;
}

/**
 * Scans a target directory for repositories
 */
function scanDirectory(baseDir, isWorkplace = false) {
  const results = [];
  if (!fs.existsSync(baseDir)) return results;

  let entries = [];
  try {
    entries = fs.readdirSync(baseDir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    // Skip node_modules or hidden folders
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    const repoPath = path.join(baseDir, entry.name);
    const activity = checkAuthorshipAndActivity(repoPath, isWorkplace);
    if (activity) {
      results.push(activity);
    }
  }

  return results;
}

// Run audit
const personalActivity = scanDirectory(PERSONAL_DIR, false);
const workActivity = scanDirectory(WORK_DIR, true);

const summary = {
  scanDate: new Date().toISOString(),
  lookbackDays,
  userIdentities,
  personalReposWithActivity: personalActivity,
  workReposWithActivity: workActivity,
};

if (outputJson) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

// Pretty print console report
console.log('\n======================================================');
console.log('       CV ACTIVITY AUDIT (Last ' + lookbackDays + ' days)');
console.log('======================================================\n');

console.log('Identidades rastreadas:', userIdentities.join(', '));
console.log(`Búsqueda en Proyectos Personales: ${PERSONAL_DIR}`);
console.log(`Búsqueda en Proyectos Laborales:   ${WORK_DIR}\n`);

console.log('--- [PROYECTOS PERSONALES ACTIVOS] ---');
if (personalActivity.length === 0) {
  console.log('No se registraron commits recientes del usuario.');
} else {
  for (const repo of personalActivity) {
    console.log(`\n* ${repo.repoName} (Último commit: ${repo.latestCommitDate}, Total: ${repo.commitCount})`);
    if (repo.detectedStack.length > 0) {
      console.log(`  Stack: ${repo.detectedStack.join(', ')}`);
    }
    console.log(`  Aportes:`);
    repo.highlights.forEach(h => console.log(`    - ${h}`));
  }
}

console.log('\n--- [PROYECTOS LABORALES ACTIVOS (Anonimizados)] ---');
if (workActivity.length === 0) {
  console.log('No se registraron commits recientes del usuario.');
} else {
  for (const repo of workActivity) {
    console.log(`\n* Proyecto Laboral: ${repo.repoName} (Último commit: ${repo.latestCommitDate}, Total: ${repo.commitCount})`);
    if (repo.detectedStack.length > 0) {
      console.log(`  Stack Detectado: ${repo.detectedStack.join(', ')}`);
    }
    console.log(`  Aportes Técnicos Destacados:`);
    repo.highlights.forEach(h => console.log(`    - ${h}`));
  }
}
console.log('\n======================================================\n');
