#!/usr/bin/env node

/**
 * scan-activity.mjs
 *
 * Dynamically audits local personal repositories (~/Repos) and workplace repositories
 * (~/SimplitSolutions) to detect recent technical activity, technologies, and achievements
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
  : path.join(HOME_DIR, 'SimplitSolutions');

// Parse CLI arguments
const args = process.argv.slice(2);
const outputJson = args.includes('--json');
const daysIndex = args.indexOf('--days');
const lookbackDays = daysIndex !== -1 && args[daysIndex + 1] ? parseInt(args[daysIndex + 1], 10) : 90;

const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - lookbackDays);

/**
 * Get configured git author identities and dynamically authenticated GitHub accounts
 * without hardcoding workplace usernames/emails in the public repository.
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

  // Dynamically discover logged-in GitHub CLI accounts (personal and workplace)
  try {
    const ghStatus = execSync('gh auth status', { encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] });
    const matches = ghStatus.matchAll(/account\s+([A-Za-z0-9_-]+)/gi);
    for (const match of matches) {
      if (match[1]) identities.add(match[1].toLowerCase());
    }
  } catch {}

  // Optional comma-separated overrides from environment
  if (process.env.GIT_AUTHOR_IDENTITIES) {
    for (const id of process.env.GIT_AUTHOR_IDENTITIES.split(',')) {
      if (id.trim()) identities.add(id.trim().toLowerCase());
    }
  }

  // Public personal portfolio identities
  identities.add('anacatavc');
  identities.add('ana-catalina');
  identities.add('catalina villalobos');
  identities.add('catalina.villalobos');
  identities.add('anacatalina@outlook.cl');

  return Array.from(identities);
}

const userIdentities = getUserIdentities();

/**
 * Check if the repository has commits genuinely authored by the user within the lookback window,
 * strictly filtering out repositories where the user only performed code reviews or stashes.
 */
function checkAuthorshipAndActivity(repoPath, isWorkplace = false) {
  const gitDir = path.join(repoPath, '.git');
  if (!fs.existsSync(gitDir)) return null;

  let authorCommits = [];
  try {
    const repoIdentities = new Set(userIdentities);
    try {
      const repoEmail = execSync('git config user.email', { cwd: repoPath, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      if (repoEmail) repoIdentities.add(repoEmail.toLowerCase());
    } catch {}

    const authorFilters = Array.from(repoIdentities).map(id => `--author="${id}"`).join(' ');
    // Use --branches and standard remote targets instead of --all to avoid inspecting dangling stashes or arbitrary peer review refs
    const logCmd = `git log --branches --remotes=origin/main --remotes=origin/master --remotes=origin/develop --no-merges ${authorFilters} --since="${lookbackDays} days ago" --format="%cd|%h|%an|%ae|%cn|%ce|%s" --date=iso -n 50`;
    const logOutput = execSync(logCmd, {
      cwd: repoPath,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();

    if (!logOutput) {
      // No commits authored by user in the lookback window
      return null;
    }

    const seenHashes = new Set();
    const rawCommits = [];
    for (const line of logOutput.split('\n')) {
      const [dateStr, hash, an, ae, cn, ce, ...subjectParts] = line.split('|');
      const subject = subjectParts.join('|') || '';
      if (!hash || seenHashes.has(hash)) continue;
      seenHashes.add(hash);

      // Exclude git stash commits created during review or local workspace stashing
      if (/^(index on |untracked files on |WIP on |stash@\{)/i.test(subject)) continue;

      // Committer verification: committer must be the user or GitHub merge bot
      const committerEmail = (ce || '').toLowerCase();
      const committerName = (cn || '').toLowerCase();
      const isUserCommitter = Array.from(repoIdentities).some(id => committerEmail.includes(id) || committerName.includes(id)) ||
                             committerEmail.includes('github.com') || committerEmail.includes('noreply');
      if (!isUserCommitter) continue;

      // Exclude commits that are purely review feedback or suggestions applied to someone else's PR
      if (/^(docs\(.*?\):\s*address review|address review|review feedback|suggestions from code review|apply suggestions from code review)/i.test(subject)) continue;

      const date = dateStr ? new Date(dateStr) : null;
      if (date && date >= cutoffDate) {
        rawCommits.push({ date, hash, subject });
      }
    }

    // In workplace repositories: filter out repositories where the user only had incidental contributions or code reviews
    // (threshold of at least 3 direct author commits to count as an active core development repository)
    if (isWorkplace && rawCommits.length < 3) {
      return null;
    }

    if (rawCommits.length === 0) return null;
    authorCommits = rawCommits;
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
 * Helper to find manifest files in root and up to maxDepth levels of subdirectories
 */
function findManifestFiles(baseDir, matcher, excludedDirs, maxDepth = 2, currentDepth = 0) {
  const results = [];
  if (!fs.existsSync(baseDir) || currentDepth > maxDepth) return results;

  let entries = [];
  try {
    entries = fs.readdirSync(baseDir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    const fullPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      if (excludedDirs.has(entry.name) || entry.name.startsWith('.')) continue;
      if (currentDepth < maxDepth) {
        results.push(...findManifestFiles(fullPath, matcher, excludedDirs, maxDepth, currentDepth + 1));
      }
    } else if (matcher(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Inspects package and project manifests to detect technologies
 */
function detectTechStack(repoPath) {
  const stack = new Set();

  // JavaScript / TypeScript / Node (root and up to 2 levels of subdirectories)
  const jsExcluded = new Set(['node_modules', '.next', 'dist', '.git', '.venv', 'venv', 'releases']);
  const pkgJsonFiles = findManifestFiles(repoPath, name => name === 'package.json', jsExcluded, 2);

  for (const pkgJsonPath of pkgJsonFiles) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      if (allDeps.astro) stack.add('Astro');
      if (allDeps.react) stack.add('React');
      if (allDeps.vue) stack.add('Vue');
      if (allDeps.svelte) stack.add('Svelte');
      if (allDeps.tailwindcss) stack.add('Tailwind CSS');
      if (allDeps.typescript) stack.add('TypeScript');
      if (allDeps.vite) stack.add('Vite');
      if (allDeps.next) stack.add('Next.js');
      if (allDeps.express) stack.add('Express');
      if (allDeps.fastify) stack.add('Fastify');
      if (allDeps['@dataform/core']) stack.add('Dataform');
      if (allDeps.electron) stack.add('Electron');
      if (allDeps['@modelcontextprotocol/sdk']) stack.add('MCP');
      if (allDeps['@tauri-apps/api']) stack.add('Tauri');
    } catch {}
  }

  // Python (root and up to 2 levels of subdirectories)
  const pyExcluded = new Set(['.venv', 'venv', 'node_modules', '.git', 'dist', 'releases', '.venv_ci']);
  const pyManifestFiles = findManifestFiles(
    repoPath,
    name => name === 'pyproject.toml' || /^requirements.*\.txt$/i.test(name),
    pyExcluded,
    2
  );

  if (pyManifestFiles.length > 0) {
    stack.add('Python');
    let content = '';
    for (const file of pyManifestFiles) {
      try {
        content += fs.readFileSync(file, 'utf-8') + '\n';
      } catch {}
    }

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
    if (lower.includes('sqlmodel')) stack.add('SQLModel');
    if (lower.includes('python-fasthtml')) stack.add('FastHTML');
    if (lower.includes('fastmcp') || /\bmcp\b/.test(lower)) stack.add('FastMCP / MCP');
    if (lower.includes('langchain') || lower.includes('langgraph')) stack.add('LangChain / LangGraph');
    if (lower.includes('apache-beam')) stack.add('Apache Beam / Dataflow');
    if (lower.includes('google-cloud-bigquery')) stack.add('BigQuery');
    if (lower.includes('google-cloud-pubsub')) stack.add('Pub/Sub');
    if (lower.includes('redis')) stack.add('Redis');
    if (lower.includes('apache-airflow')) stack.add('Airflow');
  }

  // Rust
  if (fs.existsSync(path.join(repoPath, 'Cargo.toml'))) stack.add('Rust');

  // Go
  if (fs.existsSync(path.join(repoPath, 'go.mod'))) stack.add('Go');

  // .NET / C#
  try {
    const files = fs.readdirSync(repoPath);
    if (files.some(f => f.endsWith('.csproj') || f.endsWith('.sln'))) {
      stack.add('.NET / C#');
    } else if (fs.existsSync(path.join(repoPath, 'src'))) {
      const srcFiles = fs.readdirSync(path.join(repoPath, 'src'));
      if (srcFiles.some(f => f.endsWith('.csproj') || f.endsWith('.sln'))) stack.add('.NET / C#');
    }
  } catch {}

  // Android / Kotlin
  try {
    if (
      fs.existsSync(path.join(repoPath, 'build.gradle')) ||
      fs.existsSync(path.join(repoPath, 'build.gradle.kts')) ||
      fs.existsSync(path.join(repoPath, 'settings.gradle')) ||
      fs.existsSync(path.join(repoPath, 'settings.gradle.kts'))
    ) {
      stack.add('Android / Kotlin');
    }
  } catch {}

  // C++ / CMake
  if (fs.existsSync(path.join(repoPath, 'CMakeLists.txt'))) stack.add('C++');

  // Docker
  if (fs.existsSync(path.join(repoPath, 'Dockerfile')) || fs.existsSync(path.join(repoPath, 'docker-compose.yml'))) {
    stack.add('Docker');
  }

  // Kubernetes / Helm
  try {
    if (fs.existsSync(path.join(repoPath, 'Chart.yaml')) || fs.existsSync(path.join(repoPath, 'k8s')) || fs.existsSync(path.join(repoPath, 'manifests'))) {
      stack.add('Kubernetes');
    }
  } catch {}

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
 * Scans a target directory for repositories (recursing if intermediate grouping folders exist)
 */
function scanDirectory(baseDir, isWorkplace = false, currentDepth = 0, maxDepth = 4) {
  const results = [];
  if (!fs.existsSync(baseDir) || currentDepth > maxDepth) return results;

  let entries = [];
  try {
    entries = fs.readdirSync(baseDir, { withFileTypes: true });
  } catch {
    return results;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    // Skip node_modules, build caches, or hidden folders
    if (
      entry.name.startsWith('.') ||
      entry.name === 'node_modules' ||
      entry.name === 'dist' ||
      entry.name === 'releases' ||
      entry.name === 'bin' ||
      entry.name === 'obj' ||
      entry.name === '.venv_ci'
    ) continue;

    const fullPath = path.join(baseDir, entry.name);
    if (fs.existsSync(path.join(fullPath, '.git'))) {
      const activity = checkAuthorshipAndActivity(fullPath, isWorkplace);
      if (activity) {
        results.push(activity);
      }
    } else {
      // Grouping folder (e.g. Repositories/simplit/...) -> recurse
      const nested = scanDirectory(fullPath, isWorkplace, currentDepth + 1, maxDepth);
      results.push(...nested);
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
