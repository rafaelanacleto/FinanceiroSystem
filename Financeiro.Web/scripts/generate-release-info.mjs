import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const webDirectory = resolve(scriptDirectory, '..');
const repositoryDirectory = resolve(webDirectory, '..');
const packagePath = resolve(webDirectory, 'package.json');
const lockfilePath = resolve(webDirectory, 'package-lock.json');
const releaseInfoPath = resolve(webDirectory, 'src', 'generated', 'releaseInfo.ts');
const shouldIncrementVersion = process.argv.includes('--increment');

function incrementPatchVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new Error(`Invalid semantic version: ${version}`);
  }

  return `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
}

function translateCommitMessage(message) {
  const translations = {
    'implement monthly evolution retrieval and enhance evolution chart component': 'Implementada a consulta mensal de evolução e aprimorado o gráfico de evolução.',
    'update environment configuration, enhance responsiveness, and improve UI components': 'Atualizada a configuração de ambiente, a responsividade e os componentes da interface.',
    'enhance global exception handling and improve user ID retrieval logic': 'Aprimorados o tratamento global de exceções e a obtenção do ID do usuário.',
    'update CORS configuration to dynamically retrieve allowed origins fix: adjust FinancialChart component height for better display': 'Atualizada a configuração de CORS e ajustada a altura do gráfico financeiro para melhor visualização.',
  };

  return translations[message] ?? message
    .replace(/^add\s+/i, 'Adicionado ')
    .replace(/^update\s+/i, 'Atualizado ')
    .replace(/^fix\s+/i, 'Corrigido ')
    .replace(/^implement\s+/i, 'Implementado ')
    .replace(/^enhance\s+/i, 'Aprimorado ');
}

function getRecentCommits() {
  try {
    const output = execFileSync('git', ['log', '--format=%H%x1f%s', '-4'], {
      cwd: repositoryDirectory,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    return output
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [hash, subject] = line.split('\u001f');
        const normalizedSubject = subject.trim();

        return {
          hash: hash.slice(0, 7),
          type: /^fix(?:\(.+\))?!?:/i.test(normalizedSubject) ? 'fix' : 'feature',
          message: translateCommitMessage(normalizedSubject.replace(/^[a-z]+(?:\(.+\))?!?:\s*/i, '')),
        };
      });
  } catch {
    return [];
  }
}

const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
let version = packageJson.version || '0.1.0';

if (shouldIncrementVersion) {
  version = incrementPatchVersion(version);
  packageJson.version = version;
  writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

  const lockfile = JSON.parse(readFileSync(lockfilePath, 'utf8'));
  lockfile.version = version;
  lockfile.packages[''].version = version;
  writeFileSync(lockfilePath, `${JSON.stringify(lockfile, null, 2)}\n`);
}

const recentCommits = getRecentCommits();
const releaseInfo = {
  version,
  features: recentCommits.filter((commit) => commit.type === 'feature'),
  fixes: recentCommits.filter((commit) => commit.type === 'fix'),
};

mkdirSync(dirname(releaseInfoPath), { recursive: true });
writeFileSync(
  releaseInfoPath,
  `// This file is generated during development and build. Do not edit manually.\n\nexport type ReleaseEntry = {\n  hash: string;\n  type: 'feature' | 'fix';\n  message: string;\n};\n\nexport const releaseInfo: {\n  version: string;\n  features: ReleaseEntry[];\n  fixes: ReleaseEntry[];\n} = ${JSON.stringify(releaseInfo, null, 2)};\n`,
);

console.log(`Release information generated for v${version}.`);
